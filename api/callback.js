export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const body = req.body.Body.stkCallback;
    if (body.ResultCode === 0) {
        const meta = body.CallbackMetadata.Item;
        const receipt = meta.find(i => i.Name === 'MpesaReceiptNumber').Value;
        console.log(`Payment Verified: ${receipt}`);
        // Log to a database here if you want to track users
    }
    res.status(200).json({ ResultCode: 0, ResultDesc: "Success" });
}
