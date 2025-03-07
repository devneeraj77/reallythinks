const PrivacyPolicy = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">Privacy Policy</h1>

      <section>
        <h2 className="text-2xl font-semibold">Introduction</h2>
        <p>
          ReallyThinks respects your privacy and is committed to protecting the
          personal information you share. This Privacy Policy explains how we
          collect, use, and safeguard your data.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
        <p>
          We collect minimal information for the purpose of providing the
          service. This includes:
        </p>
        <ul className="list-disc pl-6">
          <li>Your anonymous messages.</li>
          <li>Technical data, such as your device and browser information.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">
          2. How We Use Your Information
        </h2>
        <p>
          The information we collect is used solely to facilitate message
          sending, improve the platform, and ensure compliance with legal
          obligations.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">3. Data Retention</h2>
        <p>
          Your messages may be retained for a period for moderation purposes and
          to comply with legal requests. However, your identity remains
          anonymous throughout the process.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">4. Data Security</h2>
        <p>
          We implement industry-standard security measures to protect the
          information you share with us. While we strive to secure your data, no
          method is entirely foolproof.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">5. Your Rights</h2>
        <p>
          You have the right to request access to your data, request
          corrections, or request deletion of your information. Please contact
          us for more details.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">6. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Any changes will
          be posted on this page with an updated date.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
