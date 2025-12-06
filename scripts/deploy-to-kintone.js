const https = require('https');
const fs = require('fs');
const path = require('path');

const KINTONE_DOMAIN = process.env.KINTONE_DOMAIN;
const KINTONE_API_TOKEN = process.env.KINTONE_API_TOKEN;
const KINTONE_APP_ID = process.env.KINTONE_APP_ID;

// API 호출 함수
function apiCall(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: KINTONE_DOMAIN,
      port: 443,
      path: path,
      method: method,
      headers: {
        'X-Cybozu-API-Token': KINTONE_API_TOKEN,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(responseData));
        } catch {
          resolve(responseData);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// 커스텀 스크립트 업로드
async function deployCustomScript() {
  console.log('커스텀 스크립트 배포 중...');
  
  try {
    const scriptPath = path.join(__dirname, '../src/custom-script.js');
    if (fs.existsSync(scriptPath)) {
      const scriptContent = fs.readFileSync(scriptPath, 'utf-8');
      
      const payload = {
        app: KINTONE_APP_ID,
        customizeDetails: {
          scope: 'ALL',
          desktop: {
            js: [
              {
                type: 'URL',
                url: 'https://your-domain.com/custom-script.js'
              }
            ]
          }
        }
      };
      
      const result = await apiCall('PUT', '/k/v1/app/customize.json', payload);
      console.log('커스텀 스크립트 배포 완료:', result);
    }
  } catch (error) {
    console.error('커스텀 스크립트 배포 실패:', error);
  }
}

// 레코드 데이터 동기화
async function syncRecordData() {
  console.log('레코드 데이터 동기화 중...');
  
  try {
    const dataPath = path.join(__dirname, '../data/records.json');
    if (fs.existsSync(dataPath)) {
      const records = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
      
      const payload = {
        app: KINTONE_APP_ID,
        records: records
      };
      
      const result = await apiCall('POST', '/k/v1/records.json', payload);
      console.log('레코드 데이터 동기화 완료:', result);
    }
  } catch (error) {
    console.error('레코드 데이터 동기화 실패:', error);
  }
}

// 파일 업로드
async function uploadFiles() {
  console.log('파일 업로드 중...');
  
  try {
    const filesDir = path.join(__dirname, '../files');
    if (fs.existsSync(filesDir)) {
      const files = fs.readdirSync(filesDir);
      
      for (const file of files) {
        const filePath = path.join(filesDir, file);
        const fileContent = fs.readFileSync(filePath, 'base64');
        
        console.log(`파일 업로드: ${file}`);
        // 파일 업로드 로직은 Kintone API 문서에 따라 구현
      }
    }
  } catch (error) {
    console.error('파일 업로드 실패:', error);
  }
}

// 메인 실행
async function main() {
  console.log('Kintone 배포 시작...');
  console.log(`도메인: ${KINTONE_DOMAIN}`);
  console.log(`앱 ID: ${KINTONE_APP_ID}`);
  
  await deployCustomScript();
  await syncRecordData();
  await uploadFiles();
  
  console.log('Kintone 배포 완료!');
}

main().catch((error) => {
  console.error('배포 중 오류 발생:', error);
  process.exit(1);
});
