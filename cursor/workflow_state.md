# Workflow State & Rules (STM + Rules + Log)

*File này chứa trạng thái động, quy tắc nhúng, kế hoạch đang hoạt động và nhật ký cho phiên hiện tại.*
*Nó được AI đọc và cập nhật thường xuyên trong vòng lặp hoạt động của nó.*

---

## State

*Chứa trạng thái hiện tại của workflow.*

```yaml
Phase: BLUEPRINT # Giai đoạn workflow hiện tại (ANALYZE, BLUEPRINT, CONSTRUCT, VALIDATE, BLUEPRINT_REVISE)
Status: NEEDS_PLAN_APPROVAL # Trạng thái hiện tại (READY, IN_PROGRESS, BLOCKED_*, NEEDS_*, COMPLETED)
CurrentTaskID: ui_migration # ID của task chính đang được thực hiện
CurrentStep: null # ID của bước cụ thể trong kế hoạch đang được thực thi
```

---

## Plan

*Chứa kế hoạch triển khai từng bước được tạo ra trong giai đoạn BLUEPRINT.*

[ ] 1. Phân tích và lập danh sách các components Radix UI đang sử dụng
    - Tìm kiếm tất cả các imports từ Radix UI
    - Lập danh sách các components và hooks đang sử dụng
    - Xác định các dependencies và props đang được sử dụng

[ ] 2. Cài đặt và cấu hình MagicUI
    - Thêm MagicUI vào dependencies
    - Cấu hình theme và tokens
    - Thiết lập Tailwind CSS với MagicUI

[ ] 3. Tạo mapping giữa Radix UI và MagicUI components
    - Xác định các components tương đương
    - Lập kế hoạch migration cho từng component
    - Tạo các utility functions để hỗ trợ chuyển đổi

[ ] 4. Migration các components cơ bản
    - Button
    - Input
    - Form
    - Dialog
    - Dropdown
    - Checkbox
    - Radio
    - Switch
    - Tabs
    - Tooltip

[ ] 5. Migration các components phức tạp
    - DataTable
    - Combobox
    - DatePicker
    - FileUpload
    - RichTextEditor
    - Modal
    - Toast
    - Navigation

[ ] 6. Cập nhật các components tùy chỉnh
    - Cập nhật các components đã extend từ Radix UI
    - Điều chỉnh các styles và animations
    - Cập nhật các hooks và utilities liên quan

[ ] 7. Kiểm tra và tối ưu
    - Kiểm tra responsive design
    - Kiểm tra accessibility
    - Tối ưu performance
    - Kiểm tra dark mode
    - Kiểm tra các edge cases

[ ] 8. Cập nhật documentation
    - Cập nhật README
    - Cập nhật component documentation
    - Cập nhật style guide

---

## Rules

*Quy tắc nhúng điều chỉnh hoạt động tự động của AI.*

**# --- Core Workflow Rules ---**

RULE_WF_PHASE_ANALYZE:
  **Constraint:** Mục tiêu là hiểu yêu cầu/ngữ cảnh. KHÔNG giải quyết hoặc lập kế hoạch triển khai.

RULE_WF_PHASE_BLUEPRINT:
  **Constraint:** Mục tiêu là tạo kế hoạch chi tiết, rõ ràng từng bước. KHÔNG triển khai code.

RULE_WF_PHASE_CONSTRUCT:
  **Constraint:** Mục tiêu là thực thi chính xác `## Plan`. KHÔNG sai lệch. Nếu có vấn đề, kích hoạt xử lý lỗi hoặc quay lại giai đoạn.

RULE_WF_PHASE_VALIDATE:
  **Constraint:** Mục tiêu là xác minh triển khai so với `## Plan` và yêu cầu sử dụng tools. KHÔNG triển khai mới.

RULE_WF_TRANSITION_01:
  **Trigger:** Lệnh rõ ràng từ người dùng (`@analyze`, `@blueprint`, `@construct`, `@validate`).
  **Action:** Cập nhật `State.Phase` tương ứng. Log thay đổi giai đoạn.

RULE_WF_TRANSITION_02:
  **Trigger:** AI xác định ràng buộc giai đoạn hiện tại ngăn cản thực hiện yêu cầu người dùng HOẶC xử lý lỗi yêu cầu thay đổi giai đoạn.
  **Action:** Log lý do. Cập nhật `State.Phase`. Đặt `State.Status` phù hợp. Báo cáo cho người dùng.

**# --- Initialization & Resumption Rules ---**

RULE_INIT_01:
  **Trigger:** Phiên/task AI bắt đầu VÀ `workflow_state.md` bị thiếu hoặc trống.
  **Action:**
    1. Tạo `workflow_state.md` với cấu trúc mặc định.
    2. Đọc `project_config.md` (nhắc người dùng nếu thiếu).
    3. Đặt `State.Phase = ANALYZE`, `State.Status = READY`.
    4. Log "Khởi tạo phiên mới."
    5. Nhắc người dùng task đầu tiên.

RULE_INIT_02:
  **Trigger:** Phiên/task AI bắt đầu VÀ `workflow_state.md` tồn tại.
  **Action:**
    1. Đọc `project_config.md`.
    2. Đọc `workflow_state.md` hiện có.
    3. Log "Tiếp tục phiên."
    4. Kiểm tra `State.Status`: Xử lý READY, COMPLETED, BLOCKED_*, NEEDS_*, IN_PROGRESS phù hợp.

RULE_INIT_03:
  **Trigger:** Người dùng xác nhận tiếp tục qua RULE_INIT_02 (cho trạng thái IN_PROGRESS).
  **Action:** Tiến hành hành động tiếp theo dựa trên trạng thái và quy tắc đã tải.

**# --- Memory Management Rules ---**

RULE_MEM_READ_LTM_01:
  **Trigger:** Bắt đầu task hoặc giai đoạn mới chính.
  **Action:** Đọc `project_config.md`. Log hành động.

RULE_MEM_READ_STM_01:
  **Trigger:** Trước *mỗi* chu kỳ quyết định/hành động.
  **Action:** Đọc `workflow_state.md`.

RULE_MEM_UPDATE_STM_01:
  **Trigger:** Sau *mỗi* hành động quan trọng hoặc nhận thông tin.
  **Action:** Cập nhật ngay các phần liên quan trong `workflow_state.md` và lưu.

RULE_MEM_UPDATE_LTM_01:
  **Trigger:** Lệnh người dùng (`@config/update`) HOẶC kết thúc giai đoạn VALIDATE thành công cho thay đổi quan trọng.
  **Action:** Đề xuất cập nhật ngắn gọn cho `project_config.md`. Đặt `State.Status = NEEDS_LTM_APPROVAL`. Chờ xác nhận người dùng.

RULE_MEM_VALIDATE_01:
  **Trigger:** Sau khi cập nhật `workflow_state.md` hoặc `project_config.md`.
  **Action:** Thực hiện kiểm tra tính nhất quán nội bộ. Nếu có vấn đề, log và đặt `State.Status = NEEDS_CLARIFICATION`.

**# --- Tool Integration Rules (Cursor Environment) ---**

RULE_TOOL_LINT_01:
  **Trigger:** File nguồn liên quan được lưu trong giai đoạn CONSTRUCT.
  **Action:** Chỉ thị terminal Cursor chạy lệnh lint. Log thử. Khi hoàn thành, phân tích output, log kết quả, đặt `State.Status = BLOCKED_LINT` nếu có lỗi.

RULE_TOOL_FORMAT_01:
  **Trigger:** File nguồn liên quan được lưu trong giai đoạn CONSTRUCT.
  **Action:** Chỉ thị Cursor áp dụng formatter hoặc chạy lệnh format qua terminal. Log thử.

RULE_TOOL_TEST_RUN_01:
  **Trigger:** Lệnh `@validate` hoặc vào giai đoạn VALIDATE.
  **Action:** Chỉ thị terminal Cursor chạy bộ test. Log thử. Khi hoàn thành, phân tích output, log kết quả, đặt `State.Status = BLOCKED_TEST` nếu thất bại, `TESTS_PASSED` nếu thành công.

RULE_TOOL_APPLY_CODE_01:
  **Trigger:** AI xác định cần thay đổi code theo `## Plan` trong giai đoạn CONSTRUCT.
  **Action:** Tạo sửa đổi. Chỉ thị Cursor áp dụng. Log hành động.

**# --- Error Handling & Recovery Rules ---**

RULE_ERR_HANDLE_LINT_01:
  **Trigger:** `State.Status` là `BLOCKED_LINT`.
  **Action:** Phân tích lỗi trong `## Log`. Thử tự sửa nếu đơn giản/chắc chắn. Áp dụng sửa qua RULE_TOOL_APPLY_CODE_01. Chạy lại lint qua RULE_TOOL_LINT_01. Nếu thành công, reset `State.Status`. Nếu thất bại/phức tạp, đặt `State.Status = BLOCKED_LINT_UNRESOLVED`, báo cáo người dùng.

RULE_ERR_HANDLE_TEST_01:
  **Trigger:** `State.Status` là `BLOCKED_TEST`.
  **Action:** Phân tích thất bại trong `## Log`. Thử tự sửa nếu đơn giản/cục bộ/chắc chắn. Áp dụng sửa qua RULE_TOOL_APPLY_CODE_01. Chạy lại test thất bại hoặc bộ test qua RULE_TOOL_TEST_RUN_01. Nếu thành công, reset `State.Status`. Nếu thất bại/phức tạp, đặt `State.Phase = BLUEPRINT_REVISE`, `State.Status = NEEDS_PLAN_APPROVAL`, đề xuất `## Plan` sửa đổi dựa trên phân tích thất bại, báo cáo người dùng.

RULE_ERR_HANDLE_GENERAL_01:
  **Trigger:** Lỗi không mong đợi hoặc không rõ ràng.
  **Action:** Log lỗi/tình huống vào `## Log`. Đặt `State.Status = BLOCKED_UNKNOWN`. Báo cáo người dùng, yêu cầu chỉ dẫn.

---

## Log

*Log theo thời gian của các hành động, sự kiện, output tool và quyết định quan trọng.*

[2024-03-26 10:00:00] Khởi tạo phiên mới. State đặt thành ANALYZE/READY.
[2024-03-26 10:00:15] Đọc project_config.md.
[2024-03-26 10:00:30] Bắt đầu thiết lập dự án game.