import {UserNotifications} from "../../../../core/domain/aggregates/usernotifications.aggregate";
import {
    NotificationChannel,
    NotificationStatus,
} from "../../../../core/domain/constants/notification.constants";

export interface NotificationPort {
    save(
        senderId: string,
        receiverId: string,
        title: string,
        message: string,
        status: NotificationStatus,
        channel: NotificationChannel
    ): Promise<UserNotifications>;
}
