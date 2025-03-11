"use client";

import { useState } from "react";

export default function ContactForm() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        message: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Dữ liệu gửi đi:", formData);
    };

    return (
        <section id="contact" className="consultation">
            <div className="consultation-text">
                <h2>Liên hệ với chúng tôi</h2>
                <p>Sử dụng biểu mẫu liên hệ để gửi yêu cầu. Thông tin của bạn sẽ được bảo mật.</p>
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" name="firstName" placeholder="Họ" onChange={handleChange} />
                <input type="text" name="lastName" placeholder="Tên" onChange={handleChange} />
                <input type="email" name="email" placeholder="Địa chỉ email" onChange={handleChange} />
                <textarea name="message" placeholder="Tin nhắn" rows={4} onChange={handleChange}></textarea>
                <button type="submit">Gửi</button>
            </form>
        </section>
    );
}
