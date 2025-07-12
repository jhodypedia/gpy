const Imap = require('imap');
const { simpleParser } = require('mailparser');
const pool = require('../db');

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
    console.log('📬 iCloud listener aktif');

    imap.on('mail', () => {
      const fetch = imap.seq.fetch(`${box.messages.total}:*`, { bodies: '', markSeen: true });
      fetch.on('message', msg => {
        msg.on('body', stream => {
          simpleParser(stream, async (err, mail) => {
            if (err) return console.error(err);

            const subject = mail.subject || '';
            const body = mail.text || '';

            if (subject.toLowerCase().includes('gopay') || body.includes('Rp')) {
              console.log('📥 Email terdeteksi:\n', subject, '\n', body);

              const regex = /Rp\s?([\d\.]+)/;
              const match = body.match(regex);
              if (match) {
                const nominalStr = match[1].replace(/\./g, '');
                const nominal = parseInt(nominalStr);

                const [pending] = await pool.query(
                  `SELECT * FROM deposits WHERE total_transfer = ? AND status = 'pending' ORDER BY created_at DESC LIMIT 1`,
                  [nominal]
                );

                if (pending.length > 0) {
                  const deposit = pending[0];

                  await pool.query(`UPDATE deposits SET status = 'success' WHERE id = ?`, [deposit.id]);
                  await pool.query(`UPDATE users SET saldo = saldo + ? WHERE id = ?`, [deposit.jumlah, deposit.user_id]);

                  console.log(`✅ Deposit berhasil diverifikasi otomatis. ID: ${deposit.id}`);
                }
              }
            }
          });
        });
      });
    });
  });
});

imap.once('error', err => console.error('❌ Listener error:', err));
imap.once('end', () => console.log('📴 Listener berhenti'));
imap.connect();
