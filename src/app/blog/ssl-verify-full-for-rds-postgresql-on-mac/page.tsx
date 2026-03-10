import type { Metadata } from "next";
import TableOfContents from "../table-of-contents";

const toc = [
  { id: "download-ca-bundle", label: "Download the correct AWS RDS CA bundle" },
  { id: "store-certificate", label: "Where to store the certificate on macOS" },
  { id: "configure-connect", label: "Configure and connect with verify-full" },
  { id: "verify-ssl", label: "How to verify SSL is working" },
  { id: "common-errors", label: "Common errors and how to fix them" },
  { id: "macos-nuances", label: "macOS-specific nuances you need to know" },
  { id: "conclusion", label: "Conclusion" },
];

export const metadata: Metadata = {
  title: "SSL verify-full for RDS PostgreSQL on macOS",
  description:
    "Configuring sslmode=verify-full for Amazon RDS PostgreSQL on macOS. Download the AWS global CA bundle, place it where libpq can find it, and use the full RDS endpoint hostname in your connection string.",
  alternates: {
    canonical: "/blog/ssl-verify-full-for-rds-postgresql-on-mac",
  },
  openGraph: {
    title: "SSL verify-full for RDS PostgreSQL on macOS",
    description:
      "Configuring sslmode=verify-full for Amazon RDS PostgreSQL on macOS. Download the AWS global CA bundle, place it where libpq can find it, and use the full RDS endpoint hostname in your connection string.",
    url: "https://postgresmac.com/blog/ssl-verify-full-for-rds-postgresql-on-mac",
  },
};

export default function SslVerifyFullRdsPostgresqlMac() {
  return (
    <article className="relative">
      <TableOfContents items={toc} />
      <header className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-4">
          SSL verify-full for RDS PostgreSQL on macOS
        </h1>
        <p className="text-sm text-muted">By Ghazi</p>
      </header>

      <div className="space-y-8 text-base leading-relaxed text-foreground">
        <p>
          <strong>
            Configuring{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">sslmode=verify-full</code>{" "}
            for Amazon RDS PostgreSQL on macOS requires downloading the AWS
            global CA bundle, placing it where libpq can find it, and using the
            full RDS endpoint hostname in your connection string.
          </strong>{" "}
          The process is straightforward once you understand that libpq on macOS
          uses OpenSSL &mdash; not the macOS Keychain &mdash; for all
          certificate verification. This means you must explicitly provide the
          CA certificate file; the system trust store is effectively irrelevant.
          The biggest macOS-specific pitfalls involve Homebrew path differences
          on Apple Silicon, accidentally linking against a system libpq without
          SSL support, and the{" "}
          <code className="rounded bg-surface px-1.5 py-0.5 text-sm">sslrootcert=system</code>{" "}
          shortcut being unreliable on non-Homebrew installations.
        </p>


        <section>
          <h2 id="download-ca-bundle" className="text-2xl font-semibold tracking-tight mb-4">
            Download the Correct AWS RDS CA Bundle
          </h2>
          <p>
            AWS provides a <strong>global CA bundle</strong> at a single URL
            that covers all regions and all four CA types. This is the file you
            need:
          </p>
          <pre className="rounded-xl border border-border bg-surface p-6 overflow-x-auto mt-4">
            <code>{`curl -o ~/global-bundle.pem \\
  "https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem"`}</code>
          </pre>
          <p className="mt-4">
            This{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">global-bundle.pem</code>{" "}
            file contains approximately <strong>121 certificates</strong>{" "}
            spanning all four current CAs across every AWS region:{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">rds-ca-rsa2048-g1</code>{" "}
            (the default since January 2024),{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">rds-ca-rsa4096-g1</code>,{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">rds-ca-ecc384-g1</code>,
            and the now-expired{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">rds-ca-2019</code>. If
            you only need a specific region, regional bundles follow the pattern{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">
              https://truststore.pki.rds.amazonaws.com/&#123;region&#125;/&#123;region&#125;-bundle.pem
            </code>.
          </p>
          <p className="mt-4">
            <strong>
              Do not use the old{" "}
              <code className="rounded bg-surface px-1.5 py-0.5 text-sm">rds-combined-ca-bundle.pem</code>
            </strong>{" "}
            from{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">s3.amazonaws.com/rds-downloads/</code>.
            That legacy file only contained{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">rds-ca-2019</code> root
            certificates, which expired in August 2024. The new{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">global-bundle.pem</code>{" "}
            from the truststore PKI endpoint is the current, AWS-recommended
            replacement. You can verify which CA your RDS instance uses with:
          </p>
          <pre className="rounded-xl border border-border bg-surface p-6 overflow-x-auto mt-4">
            <code>{`aws rds describe-db-instances \\
  --db-instance-identifier mydbinstance \\
  --query 'DBInstances[0].CACertificateIdentifier'`}</code>
          </pre>
          <p className="mt-4">
            One important nuance from AWS documentation:{" "}
            <strong>
              only register the root CA certificate in your trust store, not
              intermediate certificates
            </strong>
            , as RDS automatically rotates server certificates and intermediates
            may change.
          </p>
        </section>


        <section>
          <h2 id="store-certificate" className="text-2xl font-semibold tracking-tight mb-4">
            Where to Store the Certificate on macOS
          </h2>
          <p>
            The PostgreSQL libpq library checks a default path for the root CA:{" "}
            <strong>
              <code className="rounded bg-surface px-1.5 py-0.5 text-sm">~/.postgresql/root.crt</code>
            </strong>{" "}
            on all Unix systems including macOS. Placing the AWS bundle there
            eliminates the need to specify{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">sslrootcert</code> in
            every connection:
          </p>
          <pre className="rounded-xl border border-border bg-surface p-6 overflow-x-auto mt-4">
            <code>{`mkdir -p ~/.postgresql
cp ~/global-bundle.pem ~/.postgresql/root.crt
chmod 644 ~/.postgresql/root.crt`}</code>
          </pre>
          <p className="mt-4">
            If you also use client certificates (for IAM database
            authentication, for example), the default paths are{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">~/.postgresql/postgresql.crt</code>{" "}
            and{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">~/.postgresql/postgresql.key</code>.
            The <strong>private key must have <code className="rounded bg-surface px-1.5 py-0.5 text-sm">0600</code> permissions</strong>{" "}
            &mdash; libpq refuses to use it otherwise:
          </p>
          <pre className="rounded-xl border border-border bg-surface p-6 overflow-x-auto mt-4">
            <code>chmod 600 ~/.postgresql/postgresql.key</code>
          </pre>
          <p className="mt-4">
            Alternatively, you can store the bundle anywhere and reference it
            explicitly via the{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">sslrootcert</code>{" "}
            parameter or the{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">PGSSLROOTCERT</code>{" "}
            environment variable. Many teams store it in a project directory or{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">/etc/ssl/certs/</code>{" "}
            for shared access.
          </p>
          <p className="mt-4">
            On Apple Silicon Macs, be aware that Homebrew installs to{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">/opt/homebrew/</code>{" "}
            rather than{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">/usr/local/</code>. This
            affects all PostgreSQL binary and library paths but does{" "}
            <strong>not</strong> change the{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">~/.postgresql/</code>{" "}
            convention for user certificates.
          </p>
        </section>


        <section>
          <h2 id="configure-connect" className="text-2xl font-semibold tracking-tight mb-4">
            Configure and Connect with verify-full
          </h2>
          <p>
            The{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">verify-full</code> SSL
            mode performs two critical checks: it validates the server&apos;s
            certificate chain against a trusted root CA, and it verifies the{" "}
            <strong>hostname matches</strong> a Subject Alternative Name (or CN)
            in the certificate. This guards against both eavesdropping and
            man-in-the-middle attacks &mdash; making it the only mode suitable
            for production use with a public CA like AWS&apos;s.
          </p>

          <h3 className="text-xl font-semibold tracking-tight mt-8 mb-3">
            psql key-value format
          </h3>
          <pre className="rounded-xl border border-border bg-surface p-6 overflow-x-auto mt-4">
            <code>{`psql "host=myinstance.abc123.us-east-1.rds.amazonaws.com \\
      port=5432 \\
      dbname=mydb \\
      user=myuser \\
      sslmode=verify-full \\
      sslrootcert=$HOME/.postgresql/root.crt"`}</code>
          </pre>

          <h3 className="text-xl font-semibold tracking-tight mt-8 mb-3">
            psql URI format
          </h3>
          <pre className="rounded-xl border border-border bg-surface p-6 overflow-x-auto mt-4">
            <code>{`psql "postgresql://myuser:mypass@myinstance.abc123.us-east-1.rds.amazonaws.com:5432/mydb?sslmode=verify-full&sslrootcert=/Users/you/.postgresql/root.crt"`}</code>
          </pre>

          <h3 className="text-xl font-semibold tracking-tight mt-8 mb-3">
            Environment variables (useful in shell profiles or CI)
          </h3>
          <pre className="rounded-xl border border-border bg-surface p-6 overflow-x-auto mt-4">
            <code>{`export PGSSLMODE=verify-full
export PGSSLROOTCERT="$HOME/.postgresql/root.crt"
psql -h myinstance.abc123.us-east-1.rds.amazonaws.com -U myuser -d mydb`}</code>
          </pre>

          <h3 className="text-xl font-semibold tracking-tight mt-8 mb-3">
            Python (psycopg2)
          </h3>
          <pre className="rounded-xl border border-border bg-surface p-6 overflow-x-auto mt-4">
            <code>{`import psycopg2
conn = psycopg2.connect(
    host="myinstance.abc123.us-east-1.rds.amazonaws.com",
    port=5432, database="mydb", user="myuser", password="mypass",
    sslmode="verify-full",
    sslrootcert="/Users/you/.postgresql/root.crt"
)`}</code>
          </pre>

          <h3 className="text-xl font-semibold tracking-tight mt-8 mb-3">
            Node.js (node-postgres)
          </h3>
          <p>
            Node-postgres uses Node&apos;s built-in TLS rather than libpq, so
            the certificate must be passed as a string in the{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">ssl.ca</code> option:
          </p>
          <pre className="rounded-xl border border-border bg-surface p-6 overflow-x-auto mt-4">
            <code>{`const { Pool } = require('pg');
const fs = require('fs');
const pool = new Pool({
    host: 'myinstance.abc123.us-east-1.rds.amazonaws.com',
    port: 5432, database: 'mydb', user: 'myuser', password: 'mypass',
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync('/Users/you/.postgresql/root.crt').toString()
    }
});`}</code>
          </pre>

          <p className="mt-4">
            <strong>Critical detail:</strong> Always use the{" "}
            <strong>full RDS endpoint hostname</strong> (e.g.,{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">
              myinstance.abc123.us-east-1.rds.amazonaws.com
            </code>
            ) &mdash; not a Route 53 CNAME alias or an IP address. The RDS
            server certificate&apos;s SAN matches the RDS-issued endpoint. A
            custom CNAME will cause hostname verification to fail.
          </p>
        </section>


        <section>
          <h2 id="verify-ssl" className="text-2xl font-semibold tracking-tight mb-4">
            How to Verify SSL Is Working
          </h2>
          <p>
            Once connected, confirm the SSL session with any of these methods:
          </p>

          <h3 className="text-lg font-semibold mt-6 mb-2">
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">\conninfo</code> in psql
            &mdash; the quickest check
          </h3>
          <pre className="rounded-xl border border-border bg-surface p-6 overflow-x-auto mt-4">
            <code>{`mydb=> \\conninfo
You are connected to database "mydb" as user "myuser" on host
"myinstance.abc123.us-east-1.rds.amazonaws.com" at port "5432".
SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, compression: off)`}</code>
          </pre>

          <h3 className="text-lg font-semibold mt-6 mb-2">
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">pg_stat_ssl</code> view
            &mdash; detailed per-connection SSL status
          </h3>
          <pre className="rounded-xl border border-border bg-surface p-6 overflow-x-auto mt-4">
            <code>{`SELECT ssl, version, cipher, bits
FROM pg_stat_ssl
WHERE pid = pg_backend_pid();`}</code>
          </pre>
          <p className="mt-4">
            Returns{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">ssl = t</code>, the TLS
            version, cipher suite, and key bits.
          </p>

          <h3 className="text-lg font-semibold mt-6 mb-2">
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">sslinfo</code> extension
            &mdash; function-based queries (must be created by an admin)
          </h3>
          <pre className="rounded-xl border border-border bg-surface p-6 overflow-x-auto mt-4">
            <code>{`CREATE EXTENSION IF NOT EXISTS sslinfo;
SELECT ssl_is_used();    -- returns t
SELECT ssl_cipher();     -- e.g., TLS_AES_256_GCM_SHA384
SELECT ssl_version();    -- e.g., TLSv1.3`}</code>
          </pre>

          <h3 className="text-lg font-semibold mt-6 mb-2">
            Audit all connections to see which are using SSL
          </h3>
          <pre className="rounded-xl border border-border bg-surface p-6 overflow-x-auto mt-4">
            <code>{`SELECT datname, usename, ssl, client_addr
FROM pg_stat_ssl
JOIN pg_stat_activity ON pg_stat_ssl.pid = pg_stat_activity.pid
ORDER BY ssl;`}</code>
          </pre>

          <p className="mt-4">
            If you want to force SSL server-side, RDS PostgreSQL{" "}
            <strong>
              15 and later defaults{" "}
              <code className="rounded bg-surface px-1.5 py-0.5 text-sm">rds.force_ssl</code> to
              1
            </strong>{" "}
            (SSL required). For PostgreSQL 14 and earlier, set{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">rds.force_ssl=1</code> in
            your DB parameter group to reject non-SSL connections.
          </p>
        </section>


        <section>
          <h2 id="common-errors" className="text-2xl font-semibold tracking-tight mb-4">
            Common Errors and How to Fix Them
          </h2>

          <h3 className="text-lg font-semibold mt-6 mb-2">
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">SSL error: certificate verify failed</code>
          </h3>
          <p>
            This is the most common error. It means libpq cannot build a valid
            certificate chain from the RDS server certificate to a trusted root.
            Causes and fixes:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>
              The{" "}
              <code className="rounded bg-surface px-1.5 py-0.5 text-sm">sslrootcert</code> path
              is wrong or the file doesn&apos;t exist. Double-check the path and
              that the file is readable.
            </li>
            <li>
              You&apos;re using the old{" "}
              <code className="rounded bg-surface px-1.5 py-0.5 text-sm">rds-combined-ca-bundle.pem</code>{" "}
              but your RDS instance now uses{" "}
              <code className="rounded bg-surface px-1.5 py-0.5 text-sm">rds-ca-rsa2048-g1</code>.
              Switch to{" "}
              <code className="rounded bg-surface px-1.5 py-0.5 text-sm">global-bundle.pem</code>.
            </li>
            <li>
              A stale{" "}
              <code className="rounded bg-surface px-1.5 py-0.5 text-sm">~/.postgresql/root.crl</code>{" "}
              file exists and contains an outdated CRL. Remove or update it.
            </li>
            <li>
              On macOS with Postgres.app or MacPorts,{" "}
              <code className="rounded bg-surface px-1.5 py-0.5 text-sm">sslrootcert=system</code>{" "}
              doesn&apos;t work because OpenSSL&apos;s default cert directory is
              misconfigured. Use an explicit path instead.
            </li>
          </ul>

          <h3 className="text-lg font-semibold mt-6 mb-2">
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">
              server certificate for &ldquo;X&rdquo; does not match host name &ldquo;Y&rdquo;
            </code>
          </h3>
          <p>
            Hostname verification failed. This happens when:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>
              You connect using an <strong>IP address</strong> instead of the
              RDS endpoint hostname.
            </li>
            <li>
              You connect via a{" "}
              <strong>custom CNAME/Route 53 alias</strong> that doesn&apos;t
              match the certificate SAN. Solution: use the RDS endpoint
              directly, or downgrade to{" "}
              <code className="rounded bg-surface px-1.5 py-0.5 text-sm">sslmode=verify-ca</code>{" "}
              (loses MITM protection).
            </li>
          </ul>

          <h3 className="text-lg font-semibold mt-6 mb-2">
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">
              sslmode value &ldquo;require&rdquo; invalid when SSL support is not compiled in
            </code>
          </h3>
          <p>
            Your psql or libpq binary was built without SSL. On macOS, this
            typically means you&apos;re accidentally using the system{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">/usr/lib/libpq.5.dylib</code>{" "}
            instead of Homebrew&apos;s. Diagnose with{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">otool -L $(which psql)</code>{" "}
            and ensure it shows a path under{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">/opt/homebrew/</code>{" "}
            (Apple Silicon) or{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">/usr/local/</code>{" "}
            (Intel). Fix:{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">brew install libpq</code>{" "}
            or{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">brew install postgresql@17</code>{" "}
            and ensure Homebrew&apos;s{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">bin</code> is first in
            your{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">PATH</code>.
          </p>

          <h3 className="text-lg font-semibold mt-6 mb-2">
            psql crashes on TLS connect
          </h3>
          <p>
            Reported after Homebrew upgraded to{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">openssl@3.2.0</code>. The
            fix is{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">brew upgrade</code> to a
            patched OpenSSL version, or pin the OpenSSL formula temporarily.
          </p>
        </section>


        <section>
          <h2 id="macos-nuances" className="text-2xl font-semibold tracking-tight mb-4">
            macOS-Specific Nuances You Need to Know
          </h2>

          <p>
            <strong>
              Homebrew&apos;s libpq uses OpenSSL, not LibreSSL or Secure
              Transport.
            </strong>{" "}
            The{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">libpq</code> and{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">postgresql</code>{" "}
            Homebrew formulas depend on{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">openssl@3</code>. Running{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">openssl version</code> in
            your terminal shows macOS&apos;s system LibreSSL, but that is{" "}
            <em>not</em> what psql uses. The PostgreSQL project considered
            adding a Secure Transport backend for macOS (which would have
            enabled Keychain integration), but{" "}
            <strong>this was never merged</strong> upstream. Consequently,{" "}
            <strong>libpq ignores the macOS Keychain entirely</strong> &mdash;
            it reads PEM files from disk, period.
          </p>

          <p className="mt-4">
            <strong>
              The{" "}
              <code className="rounded bg-surface px-1.5 py-0.5 text-sm">sslrootcert=system</code>{" "}
              feature (PostgreSQL 16+) is unreliable on macOS.
            </strong>{" "}
            This shortcut tells libpq to load the OS default certificate store.
            It works on Homebrew installations because Homebrew bootstraps CA
            certs from the macOS SystemRoots keychain into OpenSSL&apos;s cert
            directory during installation. However, it{" "}
            <strong>fails on Postgres.app and MacPorts</strong> with{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">
              certificate verify failed: unable to get local issuer certificate
            </code>
            . For RDS connections, always specify the AWS CA bundle explicitly
            rather than relying on{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">system</code>.
          </p>

          <p className="mt-4">
            <strong>Apple Silicon path differences matter.</strong> Homebrew on
            M-series Macs installs everything under{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">/opt/homebrew/</code>{" "}
            instead of{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">/usr/local/</code>. This
            changes the OpenSSL cert directory to{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">
              /opt/homebrew/etc/openssl@3/cert.pem
            </code>{" "}
            and the PostgreSQL prefix to{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">
              /opt/homebrew/opt/postgresql@17/
            </code>
            . When building Python packages like psycopg2 from source, ensure{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">pg_config</code> resolves
            to Homebrew&apos;s version:
          </p>
          <pre className="rounded-xl border border-border bg-surface p-6 overflow-x-auto mt-4">
            <code>{`export PATH="/opt/homebrew/opt/libpq/bin:$PATH"
pip install psycopg2  # now links against Homebrew's SSL-enabled libpq`}</code>
          </pre>

          <p className="mt-4">
            <strong>
              After{" "}
              <code className="rounded bg-surface px-1.5 py-0.5 text-sm">brew upgrade</code>,
              test your SSL connections.
            </strong>{" "}
            OpenSSL major version bumps through Homebrew have historically
            broken psql TLS connectivity. A quick{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">psql</code> connection
            test after upgrades can save hours of debugging.
          </p>
        </section>


        <section>
          <h2 id="conclusion" className="text-2xl font-semibold tracking-tight mb-4">
            Conclusion
          </h2>
          <p>
            The complete setup reduces to four commands: download{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">global-bundle.pem</code>,
            copy it to{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">~/.postgresql/root.crt</code>,
            set{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">sslmode=verify-full</code>{" "}
            in your connection, and verify with{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">\conninfo</code>. The
            macOS-specific insight that matters most is that{" "}
            <strong>
              libpq operates entirely through OpenSSL and PEM files
            </strong>{" "}
            &mdash; the Keychain, Secure Transport, and{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">sslrootcert=system</code>{" "}
            are all irrelevant or unreliable for RDS connections. Always use
            explicit certificate paths, always connect via the RDS endpoint
            hostname (not a CNAME or IP), and always use Homebrew&apos;s
            PostgreSQL rather than the macOS system libraries. With these
            practices,{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">verify-full</code>{" "}
            provides strong protection against both eavesdropping and
            man-in-the-middle attacks with no meaningful performance overhead.
          </p>
        </section>
      </div>
    </article>
  );
}
