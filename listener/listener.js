const Imap = require('imap');
const { simpleParser } = require('mailparser');

const imap = new Imap({
  user: 'your_email@icloud.com',
  password: 'your_app_specific_password',
  host: 'imap.mail.me.com',
  port: 993,
  tls: true
});

function openInbox(cb) {
  imap.openBox('INBOX', false, cb);
}

imap.once('ready', () => {
  openInbox((err, box) => {
    if (err) throw err;
    console.log('✅ Listener iCloud aktif.');

    imap.on('mail', () => {
      const fetch = imap.seq.fetch(`${box.messages.total}:*`, { bodies: '', markSeen: true });
      fetch.on('message', (msg) => {
        msg.on('body', (stream) => {
          simpleParser(stream, async (err, mail) => {
            if (err) return console.error(err);
            const subject = mail.subject || '';
            const body = mail.text || '';
            if (subject.includes("GoPay") || body.includes("Rp")) {
              console.log("💸 Email Detected:", subject, body);
              // TODO: verifikasi dan update deposit otomatis
            }
          });
        });
      });
    });
  });
});

imap.once('error', err => console.error('❌ IMAP Error:', err));
imap.once('end', () => console.log('🔚 iCloud listener selesai.'));
imap.connect();
