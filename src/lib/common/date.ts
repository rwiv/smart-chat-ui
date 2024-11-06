export function getPrettyDateString(dateString: string) {
  // const koreaTimeDiff = 9 * 60 * 60 * 1000 // 한국 시간은 GMT 시간보다 9시간 앞서 있다
  const koreaTimeDiff = 0;
  const kr = Date.parse(dateString) - koreaTimeDiff;
  const now = Date.now() - kr;
  const restSec = Math.round(now / 1000);
  if (restSec < 60) {
    return `${restSec}초 전`;
  } else {
    const restMinute = Math.round(now / 1000 / 60);
    return `${restMinute}분 전`;
  }
}

export function getDateString(dateString: string) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year}년 ${month}월`;
}

export function getDateTimeString(dateString: string) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return `${year}년 ${month}월 ${day}일 ${hour}시 ${minute}분 ${second}초`;
}