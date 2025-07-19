import React, { useState } from 'react';
import './help.css';

const Help = () => {
  const [tab, setTab] = useState('faq');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const faqs = [
    {
      question: 'How do I add a new lead?',
      answer: 'Go to the Leads section and click on "Add New Lead". Fill out the details and submit.'
    },
    {
      question: 'Can I assign tasks to team members?',
      answer: 'Yes, under the Tasks section, you can assign tasks to users from your CRM team.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We use end-to-end encryption and secure cloud storage for all data.'
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Support request sent successfully!');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="help-support-container">
      <h2>Help & Support</h2>

      <div className="tabs">
        <button className={tab === 'faq' ? 'active' : ''} onClick={() => setTab('faq')}>
          FAQs
        </button>
        <button className={tab === 'contact' ? 'active' : ''} onClick={() => setTab('contact')}>
          Contact Us
        </button>
      </div>

      {tab === 'faq' && (
        <div className="faq-section">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <h4>{faq.question}</h4>
              <p>{faq.answer}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'contact' && (
        <form className="support-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="How can we help you?"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            required
          />
          <button type="submit">Send Message</button>
        </form>
      )}
    </div>
  );
};

export default Help;
