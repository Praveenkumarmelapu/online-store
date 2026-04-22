import { Link } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';

const policies = {
  shipping: {
    title: 'Shipping Policy',
    icon: '🚚',
    content: [
      {
        heading: 'Delivery Areas',
        text: 'We currently deliver across all major cities in India. We are continuously expanding our delivery network to reach more areas.'
      },
      {
        heading: 'Delivery Charges',
        text: 'We offer FREE delivery on all orders above ₹499. For orders below ₹499, a flat delivery charge of ₹49 will be applied.'
      },
      {
        heading: 'Delivery Time',
        text: 'Standard delivery takes 3-5 business days from the date of order confirmation. Metro cities (Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Kolkata) may receive orders within 2-3 business days.'
      },
      {
        heading: 'Order Tracking',
        text: 'Once your order is shipped, you will receive a tracking update via your account. You can track your order status in real-time from the "My Orders" section.'
      },
      {
        heading: 'Packaging',
        text: 'All our products are carefully packed in food-grade, tamper-proof packaging to ensure freshness and quality during transit. We use eco-friendly materials wherever possible.'
      },
      {
        heading: 'Delayed Deliveries',
        text: 'In rare cases, deliveries may be delayed due to unforeseen circumstances like weather conditions, public holidays, or logistical issues. We will notify you promptly in such cases.'
      }
    ]
  },
  returns: {
    title: 'Return & Refund Policy',
    icon: '↩️',
    content: [
      {
        heading: 'Return Eligibility',
        text: 'We accept returns within 48 hours of delivery if the product is damaged, spoiled, or significantly different from what was ordered. Please contact us with photographs of the issue.'
      },
      {
        heading: 'Non-Returnable Items',
        text: 'Due to the perishable nature of our products, we cannot accept returns for items that have been opened, partially consumed, or not stored as recommended.'
      },
      {
        heading: 'How to Request a Return',
        text: 'To initiate a return, please email us at hello@snackstore.com with your order number, product details, and clear photographs showing the issue. Our team will respond within 24 hours.'
      },
      {
        heading: 'Refund Process',
        text: 'Once your return is approved, refunds will be processed within 5-7 business days. For COD orders, refunds will be issued via bank transfer to the account details you provide.'
      },
      {
        heading: 'Replacement',
        text: 'In case of damaged or incorrect products, we offer free replacement subject to product availability. Replacement items will be shipped within 2-3 business days.'
      },
      {
        heading: 'Cancellation',
        text: 'Orders can be cancelled before they are shipped. Once an order is dispatched, it cannot be cancelled but can be returned as per our return policy.'
      }
    ]
  },
  faq: {
    title: 'Frequently Asked Questions',
    icon: '❓',
    content: [
      {
        heading: 'Are your products really homemade?',
        text: 'Yes! All our snacks and sweets are freshly prepared in small batches using traditional recipes. We source premium ingredients and prepare everything in FSSAI-certified kitchens with strict hygiene standards.'
      },
      {
        heading: 'Do you use any preservatives?',
        text: 'No. Our products are 100% free from artificial preservatives, colors, and flavors. We use only natural ingredients, which is why we recommend consuming them within their best-before period.'
      },
      {
        heading: 'What is the shelf life of your products?',
        text: 'Shelf life varies by product: Namkeen & Chips: 30-45 days, Dry Fruits: 90 days, Sweets: 7-15 days, Pickles: 6-12 months, Cookies: 30 days. Always check the packaging for specific dates.'
      },
      {
        heading: 'How should I store the products?',
        text: 'Store in a cool, dry place away from direct sunlight. After opening, transfer to an airtight container. Sweets should be refrigerated for longer freshness.'
      },
      {
        heading: 'Do you offer bulk or corporate orders?',
        text: 'Yes! We offer special pricing for bulk orders and corporate gifting. Please contact us at hello@snackstore.com with your requirements for a custom quote.'
      },
      {
        heading: 'What payment methods do you accept?',
        text: 'Currently we accept Cash on Delivery (COD). We are working on adding online payment options including UPI, credit/debit cards, and net banking soon.'
      },
      {
        heading: 'Can I customize my order?',
        text: 'For bulk orders (minimum 50 units), we offer customization in packaging and assortment. Please reach out to our team for more details.'
      },
      {
        heading: 'How can I contact customer support?',
        text: 'You can reach us via email at hello@snackstore.com or call us at +91 98765 43210 (Mon-Sat, 10 AM - 7 PM). We typically respond within 24 hours.'
      }
    ]
  },
  privacy: {
    title: 'Privacy Policy',
    icon: '🔒',
    content: [
      {
        heading: 'Information We Collect',
        text: 'We collect personal information that you provide during registration, ordering, and account management. This includes your name, email address, phone number, shipping address, and order history.'
      },
      {
        heading: 'How We Use Your Information',
        text: 'Your information is used to process orders, deliver products, send order updates, improve our services, and provide customer support. We may also send promotional offers which you can opt out of at any time.'
      },
      {
        heading: 'Data Security',
        text: 'We implement industry-standard security measures to protect your personal data. All data transmissions are encrypted, and passwords are stored using secure hashing algorithms. We regularly audit our security practices.'
      },
      {
        heading: 'Third-Party Sharing',
        text: 'We do not sell, trade, or share your personal information with third parties except for logistics partners (for delivery) and payment processors (for transactions). These partners are bound by confidentiality agreements.'
      },
      {
        heading: 'Cookies',
        text: 'We use essential cookies to maintain your session and preferences. We do not use tracking cookies for advertising purposes. You can control cookie settings through your browser.'
      },
      {
        heading: 'Your Rights',
        text: 'You have the right to access, modify, or delete your personal information at any time through your account settings or by contacting us. You can also request a copy of all data we have about you.'
      },
      {
        heading: 'Contact for Privacy Concerns',
        text: 'If you have any questions or concerns about our privacy practices, please contact us at privacy@snackstore.com. We will respond to all inquiries within 48 hours.'
      }
    ]
  },
  terms: {
    title: 'Terms of Service',
    icon: '📋',
    content: [
      {
        heading: 'Acceptance of Terms',
        text: 'By accessing and using SnackStore, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our services.'
      },
      {
        heading: 'Account Responsibilities',
        text: 'You are responsible for maintaining the confidentiality of your account credentials. Any activities under your account are your responsibility. Please notify us immediately of any unauthorized access.'
      },
      {
        heading: 'Orders and Pricing',
        text: 'All prices are listed in Indian Rupees (INR) and include applicable taxes. We reserve the right to modify prices without prior notice, but changes will not affect confirmed orders.'
      },
      {
        heading: 'Product Descriptions',
        text: 'We strive to provide accurate product descriptions and images. However, slight variations in color, texture, and appearance may occur due to the handmade nature of our products. Weights are approximate and may vary by ±5%.'
      },
      {
        heading: 'Intellectual Property',
        text: 'All content on SnackStore, including logos, images, text, and design, is our intellectual property and is protected by applicable laws. You may not reproduce or distribute any content without written permission.'
      },
      {
        heading: 'Limitation of Liability',
        text: 'SnackStore shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services. Our total liability is limited to the value of the specific order in question.'
      },
      {
        heading: 'Governing Law',
        text: 'These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.'
      }
    ]
  }
};

export default function PolicyPage({ type }) {
  const policy = policies[type];

  if (!policy) {
    return (
      <div className="page-container text-center py-20">
        <span className="text-6xl block mb-4">😕</span>
        <h2 className="font-display text-2xl font-bold text-dark-800 mb-2">Page Not Found</h2>
        <Link to="/" className="btn-primary mt-4 inline-block">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="page-container animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-1 text-dark-500 hover:text-primary-500 text-sm mb-6 transition-colors">
        <HiArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-5xl block mb-3">{policy.icon}</span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-dark-800">{policy.title}</h1>
          <p className="text-dark-500 mt-2">Last updated: April 2026</p>
        </div>

        <div className="space-y-6">
          {policy.content.map((section, index) => (
            <div key={index} className="card p-6">
              <h2 className="font-display font-semibold text-lg text-dark-800 mb-3 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary-50 text-primary-600 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {index + 1}
                </span>
                {section.heading}
              </h2>
              <p className="text-dark-600 leading-relaxed pl-10">{section.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 p-6 bg-primary-50 rounded-2xl text-center">
          <p className="text-dark-600">
            Have questions? Contact us at{' '}
            <a href="mailto:hello@snackstore.com" className="text-primary-600 font-semibold hover:text-primary-700">
              hello@snackstore.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
