export default async function handler(req, res) {
    // 오픈빌더가 POST로 요청함
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    // 로또 번호 생성 함수
    const genLotto = () => {
        const nums = [];
        while (nums.length < 6) {
            const n = Math.floor(Math.random() * 45) + 1;
            if (!nums.includes(n)) nums.push(n);
        }
        return nums.sort((a, b) => a - b);
    };

    // 여러 세트 생성
    const sets = Array.from({ length: 5 }, genLotto);
    const text = sets.map(s => s.join(", ")).join("\n");

    // 카카오 오픈빌더 응답 포맷(JSON)
    const response = {
        version: "2.0",
        template: {
            outputs: [{
                simpleText: {
                    text: `🎰 오늘의 추천 로또 번호 🎰\n\n${text}`
                }
            }]
        }
    };

    res.status(200).json(response);
}