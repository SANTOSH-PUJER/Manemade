package manemade.backend.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_analytics")
public class UserAnalytics {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String platform;
    private String device;
    private String location;

    @CreationTimestamp
    @Column(name = "event_ts", updatable = false)
    private LocalDateTime eventTs;

    public UserAnalytics() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getPlatform() { return platform; }
    public void setPlatform(String platform) { this.platform = platform; }
    public String getDevice() { return device; }
    public void setDevice(String device) { this.device = device; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}
