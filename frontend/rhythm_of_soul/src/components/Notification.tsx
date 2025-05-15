import React, { useEffect, useState } from "react";
import notificationService from "../services/api/notificationService";
import { Bell } from "lucide-react";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

dayjs.extend(relativeTime);

interface NotificationItem {
  id: string;
  message: string;
  referenceId: string;
  createdAt: string;
}

const Notification: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [totalUnread, setTotalUnread] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const userId = useSelector((state: RootState) => state.user.currentUser?.id ?? "");

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
  
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8081/ws"),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("🟢 Connected to WebSocket");
        client.subscribe(`/notifications/${userId}`, (message) => {
          const newNoti: NotificationItem = JSON.parse(message.body);
          setNotifications((prev) => [newNoti, ...prev]);
          setTotalUnread((prev) => prev + 1);
        });
      },
      onStompError: (frame) => {
        console.error("WebSocket error:", frame.headers["message"]);
      },
    });
  
    client.activate();
  
    // ✅ Gọi API ở đây trong useEffect
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const unreadRes = await notificationService.getUnreadNotifications(userId);
        const unreadData = unreadRes.data || [];
  
        if (unreadData.length > 0) {
          setNotifications(unreadData);
          setTotalUnread(unreadRes.total || 0);
        } else {
          const latestRes = await notificationService.getLatestNotifications(userId, 7);
          setNotifications(latestRes.data || []);
          setTotalUnread(0);
        }
      } catch (err) {
        console.error("Failed to load notifications", err);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchNotifications();
  
    return () => {
      client.deactivate();
    };
  }, [userId]);
  

  const handleDropdownHide = async () => {
    try {
      await notificationService.markAllAsRead(userId);
      setTotalUnread(0);
    } catch (err) {
      console.error("Failed to mark notifications as read", err);
    }
  };

  return (
    <li className="nav-item dropdown">
      <a
        href="#"
        className="nav-link p-0 ps-3 position-relative"
        id="notification-drop"
        data-bs-toggle="dropdown"
        onClick={handleDropdownHide}
      >
        <Bell size={20} color="#AAAAAA" />
        {totalUnread > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {totalUnread}
          </span>
        )}
      </a>

      <ul className="p-0 sub-drop dropdown-menu dropdown-menu-end" aria-labelledby="notification-drop">
        <li>
          <div className="p-3 card-header d-flex justify-content-between bg-primary rounded-top">
            <div className="header-title">
              <h5 className="mb-0 text-white">All Notifications</h5>
            </div>
          </div>
          <div className="p-0 card-body all-notification">
            {isLoading ? (
              <div className="text-center p-3 text-muted">🔄 Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="text-center p-3 text-muted">No notifications</div>
            ) : (
              notifications.map((item) => (
                <a
                  href={item.referenceId}
                  className="iq-sub-card"
                  key={item.id}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="d-flex align-items-center">
                    <div className="ms-3 w-100">
                      <h6 className="mb-0 text-primary text-decoration-underline">{item.message}</h6>
                      <small className="text-muted">
                        {dayjs(item.createdAt).fromNow()}
                      </small>
                    </div>
                  </div>
                </a>
              ))
            )}
          </div>
        </li>
      </ul>
    </li>
  );
};

export default Notification;
