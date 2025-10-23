// api/lotto.js
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
    try {
        // ---- 2️⃣ JSON 파일에서 역대 당첨번호 불러오기 ----
        const filePath = path.join(process.cwd(), "data", "lotto_results.json");
        const pastResults = JSON.parse(fs.readFileSync(filePath, "utf8"));

        // ---- 3️⃣ Set으로 변환 (빠른 중복 체크용) ----
        const pastSet = new Set(
            pastResults.splice(1).map((arr) => arr.sort((a, b) => a - b).join(","))
        );

        // ---- 4️⃣ 중복되지 않는 새로운 조합 생성 ----
        const generateUniqueLotto = () => {
            while (true) {
                const nums = Array.from({ length: 45 }, (_, i) => i + 1);
                const picks = [];
                for (let i = 0; i < 6; i++) {
                    const idx = Math.floor(Math.random() * nums.length);
                    picks.push(nums.splice(idx, 1)[0]);
                }
                picks.sort((a, b) => a - b);
                const key = picks.join(",");
                if (!pastSet.has(key)) {
                    return picks;
                }
            }
        }

        const sets = Array.from({ length: 10 }, generateUniqueLotto);
        const result = sets.map(s => s.join(", ")).join("\n");

        // ---- 5️⃣ 카카오 오픈빌더 응답 ----
        const responseBody = {
            version: "2.0",
            template: {
                outputs: [{
                    simpleText: {
                        text: `🎰 역대 당첨번호 제외 랜덤 추천 🎰\n${result}`,
                    },
                }, ],
            },
        };

        return res.status(200).json(responseBody);
    } catch (err) {
        console.error("❌ lotto_results.json 읽기 오류:", err);

        return res.status(500).json({
            version: "2.0",
            template: {
                outputs: [{
                    simpleText: {
                        text: "❌ 로또 데이터 파일을 불러오는 중 오류가 발생했습니다.",
                    },
                }, ],
            },
        });
    }
}