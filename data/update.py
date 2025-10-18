import requests
import json

lotto_numbers_list = []
round_lotto = 1
while True:
    drwNo = round_lotto
    url = f'https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo={drwNo}'

    response = requests.get(url)
    data = response.json()
    if data['returnValue'] == 'fail':
        print(f'{drwNo}회는 아직 추첨하지 않았습니다.')
        break
    else:
        lotto_numbers_list.append([data['drwtNo1'],data['drwtNo2'],data['drwtNo3'],data['drwtNo4'],data['drwtNo5'],data['drwtNo6']])
    round_lotto += 1

# JSON 파일로 저장
with open('lotto_1st_all.txt', 'w', encoding='utf-8') as f:
    json.dump(lotto_numbers_list, f, ensure_ascii=False, indent=2)