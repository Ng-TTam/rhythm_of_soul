import axios from "axios";

import { apiConfig } from '../../config';

class NotificationService {
  async getUnreadNotifications(userId: string) {
    const res = await axios.get(apiConfig.endpoints.notification.getListNoti(userId));
    return res.data;
  }

  async markAllAsRead(userId: string) {
    return await axios.put(apiConfig.endpoints.notification.markAllRead(userId));
  }
  async getLatestNotifications(userId: string, days: number = 7) {
    const res = await axios.get(apiConfig.endpoints.notification.getLatestNoti(userId, days));
    return res.data;
  }
}

const notificationServiceInstance = new NotificationService();

export default notificationServiceInstance;