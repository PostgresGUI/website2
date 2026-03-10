import type { Metadata } from "next";
import TableOfContents from "../table-of-contents";

const toc = [
  { id: "what-is-ssh-tunnel", label: "What is an SSH tunnel?" },
  { id: "prerequisites", label: "Prerequisites" },
  { id: "basic-command", label: "The basic tunnel command" },
  { id: "background", label: "Run in the background" },
  { id: "jump-host", label: "Connecting through a jump host" },
  { id: "ssh-config", label: "Using ~/.ssh/config" },
  { id: "keepalive", label: "Keeping the tunnel alive" },
  { id: "pgpass", label: "Using a .pgpass file" },
  { id: "workflow", label: "Putting it all together" },
  { id: "troubleshooting", label: "Troubleshooting" },
  { id: "summary", label: "Summary" },
];

export const metadata: Metadata = {
  title: "SSH Tunneling to PostgreSQL: A Complete CLI Tutorial",
  description:
    "Learn how to securely connect to remote PostgreSQL databases using SSH tunnels. Covers basic tunneling, background processes, jump hosts, SSH config, keepalive, and .pgpass setup.",
  alternates: {
    canonical: "/blog/ssh-tunnel-postgres",
  },
  openGraph: {
    title: "SSH Tunneling to PostgreSQL: A Complete CLI Tutorial",
    description:
      "Learn how to securely connect to remote PostgreSQL databases using SSH tunnels. Covers basic tunneling, background processes, jump hosts, SSH config, keepalive, and .pgpass setup.",
    url: "https://postgresmac.com/blog/ssh-tunnel-postgres",
  },
};

export default function SshTunnelPostgres() {
  return (
    <article className="relative">
      <TableOfContents items={toc} />
      <header className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-4">
          SSH Tunneling to PostgreSQL: A Complete CLI Tutorial
        </h1>
        <p className="text-sm text-muted">By Ghazi</p>
      </header>

      <div className="space-y-8 text-base leading-relaxed text-foreground">
        <p>
          If your PostgreSQL database lives on a remote server, there&apos;s a
          good chance direct access is (and should be) blocked by a firewall.
          SSH tunneling is the standard way to connect securely — it routes
          your database traffic through an encrypted SSH connection, so you
          never expose Postgres to the public internet.
        </p>
        <p>
          This guide walks through everything you need: how SSH tunnels work,
          how to set one up, and how to manage connections cleanly in
          day-to-day use.
        </p>


        <section>
          <h2 id="what-is-ssh-tunnel" className="text-2xl font-semibold tracking-tight mb-4">
            What Is an SSH Tunnel?
          </h2>
          <p>
            An SSH tunnel creates an encrypted channel between your local
            machine and a remote server. When you tunnel to a database,
            you&apos;re telling your SSH client: &ldquo;forward traffic from a
            local port on my machine to a specific host and port on the remote
            network.&rdquo;
          </p>
          <p className="mt-4">
            For PostgreSQL, it looks like this:
          </p>
          <pre className="rounded-xl border border-border bg-surface p-6 overflow-x-auto mt-4">
            <code>Your Machine (localhost:5433) → SSH Server → PostgreSQL (localhost:5432)</code>
          </pre>
          <p className="mt-4">
            Your local application connects to{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">localhost:5433</code>.
            The SSH client silently forwards that connection through the SSH
            connection to the remote server, where it reaches Postgres at{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">localhost:5432</code>{" "}
            (or wherever Postgres is listening). From Postgres&apos;s
            perspective, the connection is coming from its own machine — not
            the public internet.
          </p>
          <p className="mt-4">This pattern is useful when:</p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>
              Your Postgres port (5432) is not open to the internet (the
              correct default)
            </li>
            <li>
              You need to connect to a database on a private network
            </li>
            <li>
              You want encrypted traffic without configuring SSL on Postgres
              itself
            </li>
          </ul>
        </section>


        <section>
          <h2 id="prerequisites" className="text-2xl font-semibold tracking-tight mb-4">
            Prerequisites
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              SSH access to the server running PostgreSQL (or a jump host on
              the same network)
            </li>
            <li>
              <code className="rounded bg-surface px-1.5 py-0.5 text-sm">ssh</code>{" "}
              installed locally (comes with macOS and most Linux distros; on
              Windows, use WSL or Git Bash)
            </li>
            <li>
              <code className="rounded bg-surface px-1.5 py-0.5 text-sm">psql</code>{" "}
              installed locally if you want to use the CLI client
            </li>
          </ul>
        </section>


        <section>
          <h2 id="basic-command" className="text-2xl font-semibold tracking-tight mb-4">
            The Basic Tunnel Command
          </h2>
          <pre className="rounded-xl border border-border bg-surface p-6 overflow-x-auto">
            <code>ssh -L 5433:localhost:5432 user@your-server.com -N</code>
          </pre>
          <p className="mt-4">Breaking this down:</p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>
              <code className="rounded bg-surface px-1.5 py-0.5 text-sm">-L 5433:localhost:5432</code>{" "}
              — bind local port{" "}
              <code className="rounded bg-surface px-1.5 py-0.5 text-sm">5433</code>,
              forward to{" "}
              <code className="rounded bg-surface px-1.5 py-0.5 text-sm">localhost:5432</code>{" "}
              on the remote server
            </li>
            <li>
              <code className="rounded bg-surface px-1.5 py-0.5 text-sm">user@your-server.com</code>{" "}
              — your SSH login
            </li>
            <li>
              <code className="rounded bg-surface px-1.5 py-0.5 text-sm">-N</code>{" "}
              — don&apos;t execute a remote command; just forward the port
              (keeps the terminal clean)
            </li>
          </ul>
          <p className="mt-4">
            Once that&apos;s running, open a second terminal and connect with{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">psql</code>:
          </p>
          <pre className="rounded-xl border border-border bg-surface p-6 overflow-x-auto mt-4">
            <code>psql -h localhost -p 5433 -U your_db_user -d your_database</code>
          </pre>
          <p className="mt-4">
            You&apos;re connecting to{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">localhost:5433</code>{" "}
            locally, but your traffic is being forwarded to Postgres on the
            remote server.
          </p>

          <h3 className="text-xl font-semibold tracking-tight mt-8 mb-3">
            Why 5433 and not 5432?
          </h3>
          <p>
            You can use any available local port. Port{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">5433</code>{" "}
            is a common choice to avoid conflicting with a local Postgres
            instance that might already be listening on{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">5432</code>.
            If you don&apos;t have Postgres installed locally, you can use{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">5432</code>{" "}
            on both ends.
          </p>
        </section>


        <section>
          <h2 id="background" className="text-2xl font-semibold tracking-tight mb-4">
            Run the Tunnel in the Background
          </h2>
          <p>
            The{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">-N</code>{" "}
            flag keeps the tunnel open but ties up your terminal. To run it in
            the background instead:
          </p>
          <pre className="rounded-xl border border-border bg-surface p-6 overflow-x-auto mt-4">
            <code>ssh -L 5433:localhost:5432 user@your-server.com -N -f</code>
          </pre>
          <p className="mt-4">
            The{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">-f</code>{" "}
            flag forks the process to the background before executing. The
            tunnel will stay open until you kill it or close your SSH
            connection.
          </p>
          <p className="mt-4">To find and kill the background tunnel:</p>
          <pre className="rounded-xl border border-border bg-surface p-6 overflow-x-auto mt-4">
            <code>{`# Find the process
lsof -ti:5433

# Kill it
kill $(lsof -ti:5433)`}</code>
          </pre>
        </section>


        <section>
          <h2 id="jump-host" className="text-2xl font-semibold tracking-tight mb-4">
            Connecting Through a Jump Host
          </h2>
          <p>
            Sometimes your Postgres server isn&apos;t directly SSH-accessible
            — it&apos;s on a private network behind a bastion or jump host.
            SSH handles this natively:
          </p>
          <pre className="rounded-xl border border-border bg-surface p-6 overflow-x-auto mt-4">
            <code>{`ssh -J jumpuser@bastion.example.com \\
    -L 5433:db-server.internal:5432 \\
    dbuser@db-server.internal \\
    -N`}</code>
          </pre>
          <p className="mt-4">Here:</p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>
              <code className="rounded bg-surface px-1.5 py-0.5 text-sm">-J jumpuser@bastion.example.com</code>{" "}
              — SSH jumps through the bastion first
            </li>
            <li>
              <code className="rounded bg-surface px-1.5 py-0.5 text-sm">db-server.internal</code>{" "}
              — the actual database server, only reachable from within the
              private network
            </li>
            <li>
              The forward still binds{" "}
              <code className="rounded bg-surface px-1.5 py-0.5 text-sm">localhost:5433</code>{" "}
              on your machine
            </li>
          </ul>
        </section>


        <section>
          <h2 id="ssh-config" className="text-2xl font-semibold tracking-tight mb-4">
            Using ~/.ssh/config for Cleaner Connections
          </h2>
          <p>
            Typing long SSH commands every time gets old fast. Add a host
            entry to{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">~/.ssh/config</code>:
          </p>
          <pre className="rounded-xl border border-border bg-surface p-6 overflow-x-auto mt-4">
            <code>{`Host mydb
  HostName your-server.com
  User your-ssh-user
  IdentityFile ~/.ssh/id_ed25519
  LocalForward 5433 localhost:5432`}</code>
          </pre>
          <p className="mt-4">
            Now you can bring up the tunnel with just:
          </p>
          <pre className="rounded-xl border border-border bg-surface p-6 overflow-x-auto mt-4">
            <code>ssh -N mydb</code>
          </pre>
          <p className="mt-4">And connect to Postgres the same way:</p>
          <pre className="rounded-xl border border-border bg-surface p-6 overflow-x-auto mt-4">
            <code>psql -h localhost -p 5433 -U your_db_user -d your_database</code>
          </pre>
          <p className="mt-4">For a jump host setup:</p>
          <pre className="rounded-xl border border-border bg-surface p-6 overflow-x-auto mt-4">
            <code>{`Host mydb
  HostName db-server.internal
  User dbuser
  ProxyJump jumpuser@bastion.example.com
  LocalForward 5433 localhost:5432`}</code>
          </pre>
        </section>


        <section>
          <h2 id="keepalive" className="text-2xl font-semibold tracking-tight mb-4">
            Keeping the Tunnel Alive
          </h2>
          <p>
            Long-running tunnels can time out if there&apos;s no traffic. To
            prevent this, configure keepalive settings in your{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">~/.ssh/config</code>:
          </p>
          <pre className="rounded-xl border border-border bg-surface p-6 overflow-x-auto mt-4">
            <code>{`Host mydb
  HostName your-server.com
  User your-ssh-user
  LocalForward 5433 localhost:5432
  ServerAliveInterval 60
  ServerAliveCountMax 3`}</code>
          </pre>
          <p className="mt-4">
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">ServerAliveInterval 60</code>{" "}
            sends a keepalive packet every 60 seconds.{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">ServerAliveCountMax 3</code>{" "}
            drops the connection after 3 missed responses (so it fails loudly
            rather than hanging silently).
          </p>
        </section>


        <section>
          <h2 id="pgpass" className="text-2xl font-semibold tracking-tight mb-4">
            Using a .pgpass File for Password-Free Connections
          </h2>
          <p>
            If your Postgres user requires a password, you can store
            credentials in{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">~/.pgpass</code>{" "}
            so you&apos;re not prompted every time:
          </p>
          <pre className="rounded-xl border border-border bg-surface p-6 overflow-x-auto mt-4">
            <code>{`# Format: hostname:port:database:username:password
localhost:5433:your_database:your_db_user:your_password`}</code>
          </pre>
          <p className="mt-4">
            Set the correct permissions (Postgres will ignore the file if
            it&apos;s world-readable):
          </p>
          <pre className="rounded-xl border border-border bg-surface p-6 overflow-x-auto mt-4">
            <code>chmod 600 ~/.pgpass</code>
          </pre>
          <p className="mt-4">
            Now{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">psql -h localhost -p 5433 -U your_db_user -d your_database</code>{" "}
            connects without a password prompt.
          </p>
        </section>


        <section>
          <h2 id="workflow" className="text-2xl font-semibold tracking-tight mb-4">
            Putting It All Together: A Typical Workflow
          </h2>
          <p className="font-semibold mt-4">
            1. Open the tunnel (one terminal, stays running):
          </p>
          <pre className="rounded-xl border border-border bg-surface p-6 overflow-x-auto mt-4">
            <code>ssh -N mydb</code>
          </pre>
          <p className="font-semibold mt-6">
            2. Connect with psql (another terminal):
          </p>
          <pre className="rounded-xl border border-border bg-surface p-6 overflow-x-auto mt-4">
            <code>psql -h localhost -p 5433 -U your_db_user -d your_database</code>
          </pre>
          <p className="font-semibold mt-6">
            3. When you&apos;re done, close the tunnel:
          </p>
          <pre className="rounded-xl border border-border bg-surface p-6 overflow-x-auto mt-4">
            <code>{`# If running in the foreground: Ctrl+C
# If backgrounded:
kill $(lsof -ti:5433)`}</code>
          </pre>
        </section>


        <section>
          <h2 id="troubleshooting" className="text-2xl font-semibold tracking-tight mb-4">
            Troubleshooting
          </h2>

          <h3 className="text-lg font-semibold mt-6 mb-2">
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">bind: Address already in use</code>
          </h3>
          <p>
            The local port is already taken. Either kill the existing process
            using that port (
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">lsof -ti:5433 | xargs kill</code>
            ) or pick a different local port.
          </p>

          <h3 className="text-lg font-semibold mt-6 mb-2">
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">Connection refused</code> on psql
          </h3>
          <p>
            The tunnel may not be open, or psql is connecting to the wrong
            port. Double-check that the{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">ssh -N</code>{" "}
            process is still running.
          </p>

          <h3 className="text-lg font-semibold mt-6 mb-2">
            Tunnel drops after a few minutes of inactivity
          </h3>
          <p>
            Add{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">ServerAliveInterval</code>{" "}
            and{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">ServerAliveCountMax</code>{" "}
            to your SSH config (see above).
          </p>

          <h3 className="text-lg font-semibold mt-6 mb-2">
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">Permission denied (publickey)</code>
          </h3>
          <p>
            Your SSH key isn&apos;t authorized on the server. Check that your
            public key is in{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">~/.ssh/authorized_keys</code>{" "}
            on the remote machine, and that you&apos;re pointing at the right
            private key with{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">IdentityFile</code>.
          </p>

          <h3 className="text-lg font-semibold mt-6 mb-2">
            Can&apos;t reach Postgres through the tunnel but SSH works fine
          </h3>
          <p>
            Postgres might be bound to{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">127.0.0.1</code>{" "}
            only (the default). Check{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">listen_addresses</code>{" "}
            in{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">postgresql.conf</code>.
            For tunnel connections,{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">127.0.0.1</code>{" "}
            is correct — the tunnel terminates on localhost at the remote end.
          </p>
        </section>


        <section>
          <h2 id="summary" className="text-2xl font-semibold tracking-tight mb-4">
            Summary
          </h2>
          <p>
            SSH tunneling is the right way to connect to a remote PostgreSQL
            database. It keeps Postgres off the public internet, encrypts your
            traffic, and requires nothing beyond standard SSH access. Once
            you&apos;ve added a host entry to{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-sm">~/.ssh/config</code>,
            the workflow is just two commands: open the tunnel, connect with
            psql.
          </p>
        </section>
      </div>
    </article>
  );
}
