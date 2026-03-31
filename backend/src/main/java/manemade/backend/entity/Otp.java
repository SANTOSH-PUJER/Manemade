package manemade.backend.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "otps")
public class Otp {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String otp;

    @Column(name = "expiry_ts", nullable = false)
    private LocalDateTime expiryTs;

    @CreationTimestamp
    @Column(name = "created_ts", updatable = false)
    private LocalDateTime createdTs;

    public Otp() {}

    public Otp(String email, String otp, LocalDateTime expiryTs) {
        this.email = email;
        this.otp = otp;
        this.expiryTs = expiryTs;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }
    public LocalDateTime getExpiryTs() { return expiryTs; }
    public void setExpiryTs(LocalDateTime expiryTs) { this.expiryTs = expiryTs; }
    public LocalDateTime getCreatedTs() { return createdTs; }
}
