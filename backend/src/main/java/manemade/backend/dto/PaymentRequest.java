package manemade.backend.dto;

public class PaymentRequest {
    private Long orderId;
    private Long userId;
    private String method;
    private Double amount;
    private String transactionId;
    private String status;

    public PaymentRequest() {}

    public static PaymentRequestBuilder builder() {
        return new PaymentRequestBuilder();
    }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getMethod() { return method; }
    public void setMethod(String method) { this.method = method; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public static class PaymentRequestBuilder {
        private PaymentRequest instance = new PaymentRequest();
        public PaymentRequestBuilder orderId(Long orderId) { instance.setOrderId(orderId); return this; }
        public PaymentRequestBuilder userId(Long userId) { instance.setUserId(userId); return this; }
        public PaymentRequestBuilder method(String method) { instance.setMethod(method); return this; }
        public PaymentRequestBuilder amount(Double amount) { instance.setAmount(amount); return this; }
        public PaymentRequestBuilder transactionId(String transactionId) { instance.setTransactionId(transactionId); return this; }
        public PaymentRequestBuilder status(String status) { instance.setStatus(status); return this; }
        public PaymentRequest build() { return instance; }
    }
}
