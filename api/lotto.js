// api/lotto.js

import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    // ✅ 1. 역대 당첨번호 로드
    const filePath = path.join(process.cwd(), 'data', 'lotto_results.json');
    const pastResults = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // ✅ 2. 조합을 문자열로 저장해서 빠른 비교용 Set 생성
    const pastSet = new Set(
        pastResults.map(arr => arr.sort((a, b) => a - b).join(','))
    );

    // ✅ 3. 중복되지 않는 새 번호 생성
    function generateUniqueLotto() {
        while (true) {
            const nums = Array.from({ length: 45 }, (_, i) => i + 1);
            const picks = [];
            for (let i = 0; i < 6; i++) {
                const idx = Math.floor(Math.random() * nums.length);
                picks.push(nums.splice(idx, 1)[0]);
            }
            picks.sort((a, b) => a - b);
            const key = picks.join(',');
            if (!pastSet.has(key)) {
                return picks;
            }
        }
    }


    // ✅ 4. 최종 로또번호 생성
    const result = generateUniqueLotto();

    // ✅ 5. 카카오 오픈빌더용 응답 형식
    const responseBody = {
        version: '2.0',
        template: {
            outputs: [{
                simpleText: {
                    text: `🎰 추천 로또 번호 🎰\n${result.join(', ')}`
                }
            }]
        }
    };

    res.status(200).json(responseBody);
}