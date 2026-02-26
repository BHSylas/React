# 프런트엔드 실행 방법

프런트엔드를 시작하려면 아래의 절차를 따르십시오:

**처음 시작하는 경우라면 여기부터 시작하세요**
1. git clone을 실행하거나, 코드 파일을 다운로드하십시오.
2. 코드 메인 폴더(`public` 폴더와 `src` 폴더가 보여야 합니다)에서 CMD를 열어, 아래 명령어를 실행하십시오:
```npm install -y```

**다시 실행하는 경우라면 여기부터 시작하세요**

3. CMD 창을 닫지 말고, 그 상태에서 `npm run dev` 를 입력하여 실행하십시오.
4. 정상적으로 실행되었다면, 브라우저에서 `localhost:5173` 에 접속할 수 있습니다. 
5. 종료하려면 CMD 창에서 `Ctrl + C` 를 2~3번 누르면 됩니다.

만약 `localhost:5173`으로 접속할 수 없다면, 그냥 컴퓨터를 껐다 켜보세요. 그럴 수 없다면 아래 절차를 따르십시오:
```
1. CMD에 netstat -ano | findstr 5173 을 입력하십시오.
2. LISTENING 오른쪽의 숫자를 기억하십시오.
3. CMD에 taskkill -f -pid 를 입력하고, 기억한 숫자를 다음에 쓰십시오.
만약 LISTENING 오른쪽의 숫자가 12345였다면 아래처럼 입력하면 됩니다:
taskkill -f -pid 12345
```

# WebGL 빌드 포함시키기
Unity WebGL 빌드를 갱신하려면 아래 절차를 따르세요:

1. 코드 메인 폴더(`public` 폴더와 `src` 폴더가 보여야 합니다)에서 시작하여, `public` 폴더로 들어가세요.
2. `unity` 폴더 안에 WebGL 빌드 파일을 집어넣으세요. 덮어쓰기를 할 것인지 물어본다면 덮어쓰세요.
WebGL 빌드 핵심 파일(`Build` 폴더 내부 파일)의 명칭은 다음과 같아야 합니다:

`Builds.data, Builds.framework.js, Builds.loader.js, Builds.wasm`

3. 파일을 집어넣었다면 테스트를 실행해보세요.


# 백엔드와 연동하기
백엔드와 연동은 자동으로 이루어집니다. 허나 만약 프런트와 백엔드의 연동 실패가 확인되었을 경우, 아래 내용을 따라하세요:

1. 코드 메인 폴더(`public` 폴더와 `src` 폴더가 보여야 합니다) 에서 `vite.config.ts` 파일을 찾으세요.
2. 해당 파일의 내용을 아래처럼 만드세요:
```import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
```

3. 이제 정상 실행되는지 확인해보세요.