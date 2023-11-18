# Thông tin đồ án

Bộ ứng dụng web, quản lý quảng cáo thành phố:

Build 2 web app riêng biệt

1. Cho người dân bình thường xài (anonymous) xem thông tin chi tiết, báo cáo sai phạm bất kỳ

   - Bản đồ phóng lên, thu nhỏ, kéo qua về
   - Tìm kiếm vị trí, bản đồ nhảy tới đó
   - Nhấn 1 điểm trên bản đồ thì ra tọa độ, địa chỉ.

2. Cho cán bộ, nv xài (phường, quận, sở)

Map: Vietbando hoặc Google map

Quy trình: Sở văn hóa quyết định chỗ nào đặt được ngoài đường, và bao nhiêu qc -> Các cty sẽ đến xin để đặt -> Sẽ được xem xét và duyệt.

# Yêu cầu alternative RestufulAPI để kết nối 2 máy tính

- Tất cả các nhóm làm GRPC
- Xài yêu cầu đơn giản: 1 + 1 = 2
- Message Queue (Capcha,RabbitMQ):
  - Phân biệt async / sync api call
- Khi nào nên sử dụng message queue, khi nào sử dụng Restful API

# Làm socket

- Express: SocketIO (gợi ý)
- 2 client chat realtime, không cần F5
- Giao diện: 2 file html có chat box, nút gửi

React

Redux

Router
