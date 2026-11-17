
import cron from "node-cron";
import Reminder from "../models/reminder.model.js";
import { sendEmail } from "../utils/email.service.js";

export const startReminder = () => {
    cron.schedule("*/5 * * * *", async () => {
        console.log("Reminder cron running:", new Date());

        try {
            const now = new Date();

            const reminders = await Reminder.find({
                remindAt: { $lte: now },
                completed: false,
                emailSent: false
            }).select("_id");

            for (const item of reminders) {

                // Lock expires after 15 minutes
                const staleBefore = new Date(
                    Date.now() - 15 * 60 * 1000
                );

                // Atomically claim reminder
                const reminder = await Reminder.findOneAndUpdate(
                    {
                        _id: item._id,
                        completed: false,
                        emailSent: false,
                        $or: [
                            { emailProcessing: false },
                            { emailProcessing: { $exists: false } },
                            { processingAt: { $lte: staleBefore } }
                        ]
                    },
                    {
                        $set: {
                            emailProcessing: true,
                            processingAt: now
                        }
                    },
                    { new: true }
                ).populate("user", "email");

                // Already claimed by another worker
                if (!reminder) continue;

                try {
                    if (!reminder.user?.email) {
                        throw new Error("User email not found");
                    }

                    await sendEmail({
                        to: reminder.user.email,
                        subject: "NextHire Reminder",
                        text: `Reminder: ${reminder.title}`
                    });

                    // Mark as sent after successful SMTP response
                    await Reminder.updateOne(
                        { _id: reminder._id },
                        {
                            $set: {
                                emailSent: true,
                                emailProcessing: false
                            },
                            $unset: {
                                processingAt: 1
                            }
                        }
                    );

                    console.log(
                        "Reminder email sent:",
                        reminder.title
                    );

                } catch (error) {
                    console.error(
                        "Reminder email failed:",
                        error.message
                    );

                    // Release lock for retry
                    await Reminder.updateOne(
                        { _id: reminder._id },
                        {
                            $set: {
                                emailProcessing: false
                            },
                            $unset: {
                                processingAt: 1
                            }
                        }
                    );
                }
            }

        } catch (error) {
            console.error("Reminder cron error:", error);
        }
    });
};
