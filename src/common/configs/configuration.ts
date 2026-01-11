export default () => ({
  // 1. parseInt에 빨간 줄이 사라집니다. (PORT가 무조건 string이라고 알기 때문)
  port: parseInt(process.env.PORT, 10),

  redis: {
    // 2. ! 없이 자연스럽게 사용 가능
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10),

    // 3. Optional 값은 그대로 둠
    password: process.env.REDIS_PASSWORD,
  },
});
