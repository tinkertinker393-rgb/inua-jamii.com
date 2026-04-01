export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const callbackData = req.body.Body.stkCallback;
    
    if (callbackData.ResultCode === 0) {
        const metadata = callbackData.CallbackMetadata.Item;
        const mpesaReceipt = metadata.find(i => i.Name === 'MpesaReceiptNumber').Value;
        
        console.log(`SUCCESS: Payment verified. Receipt: ${mpesaReceipt}`);
        // Add your logic here to determine if they won the 20,000 KES
    } else {
        console.log(`FAILED: ${callbackData.ResultDesc}`);
    }

    res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });
}
