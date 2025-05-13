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
}

const notificationServiceInstance = new NotificationService();

export default notificationServiceInstance;
