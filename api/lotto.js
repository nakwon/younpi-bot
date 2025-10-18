// api/lotto.js

export default async function handler(req, res) {

    // ---- 1️⃣ 역대 당첨번호 불러오기 ----
    const allResults = [];
    let drawNo = 1;

    try {
        while (true) {
            const resApi = await fetch(
                `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${drawNo}`
            );
            const data = await resApi.json();

            if (!data.returnValue || data.returnValue !== "success") break;

            allResults.push([
                data.drwtNo1,
                data.drwtNo2,
                data.drwtNo3,
                data.drwtNo4,
                data.drwtNo5,
                data.drwtNo6,
            ]);
            drawNo++;
        }
    } catch (err) {
        console.error("로또 API 오류:", err);
        return res.status(200).json({
            version: "2.0",
            template: {
                outputs: [
                    { simpleText: { text: "❌ 동행복권 서버 접속 중 오류가 발생했습니다." } }
                ]
            }
        });
    }

    // ---- 2️⃣ 당첨 조합 세트로 변환 ----
    const pastSet = new Set(
        allResults.map(arr => arr.sort((a, b) => a - b).join(","))
    );

    // ---- 3️⃣ 중복되지 않는 새 번호 생성 ----
    function generateUniqueLotto() {
        while (true) {
            const nums = Array.from({ length: 45 }, (_, i) => i + 1);
            const picks = [];
            for (let i = 0; i < 6; i++) {
                const idx = Math.floor(Math.random() * nums.length);
                picks.push(nums.splice(idx, 1)[0]);
            }
            picks.sort((a, b) => a - b);
            const key = picks.join(",");
            if (!pastSet.has(key)) return picks;
        }
    }

    // ---- 4️⃣ 결과 생성 ----
    const result = generateUniqueLotto();

    // ---- 5️⃣ 카카오 오픈빌더 응답 ----
    const responseBody = {
        version: "2.0",
        template: {
            outputs: [{
                simpleText: {
                    text: `🎰 실시간 최신 당첨번호 제외 랜덤 추천 🎰\n${result.join(", ")}`
                }
            }]
        }
    };

    res.status(200).json(responseBody);
}