export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { phone, amount } = req.body;

    // Use environment variables for security on Vercel
    const shortCode = "174379"; 
    const passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"; 
    const consumerKey = process.env.MPESA_CONSUMER_KEY; 
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;

    const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
    const password = Buffer.from(shortCode + passkey + timestamp).toString('base64');

    try {
        // Get Token
        const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
        const tokenRes = await fetch("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
            headers: { Authorization: `Basic ${auth}` }
        });
        const { access_token } = await tokenRes.json();

        // Send STK Push
        const response = await fetch("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${access_token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                BusinessShortCode: shortCode,
                Password: password,
                Timestamp: timestamp,
                TransactionType: "CustomerPayBillOnline",
                Amount: amount,
                PartyA: phone,
                PartyB: shortCode,
                PhoneNumber: phone,
                CallBackURL: `https://${req.headers.host}/api/callback`,
                AccountReference: "LuckyBallGame",
                TransactionDesc: "Entry Fee"
            })
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
