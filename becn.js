// 1.接收三个实参 第一个是 配置对象 第二个是取消请求的回调函数 第三个是获取下载进度的回调函数
const becn = (obj, interrupt, progress) => {
  // 设置超时函数实列
  const abortController = new AbortController()
  obj.abortController = abortController

  // 封装处理请求超时函数
  const requestTime = (obj, interrupt, request) => {
    // 设置发起请求之后多久中断网络请求，默认设置 2.5 秒超时时间。
    becn.setTime = setTimeout(
      () => {
        obj.abortController.abort()
      },
      obj.time ? obj.time : 2500
    )

    // 封装手动取消当前请求函数
    becn.cancelRequest = () => {
      // 取消定时器
      clearTimeout(becn.setTime)
      // 取消请求
      obj.abortController.abort()
    }

    // 指定取消当前请求,becn 接收一个 null 变量，再 push 到外面的变量。
    if (interrupt) {
      request.cancelRequest = becn.cancelRequest
      interrupt.push(request)
    }
  }

  // 封装处理请求方式函数
  const requestMethod = (obj) => {
    // 开始判断是否有设置请求方式，如果没有则默认设置为get请求
    if (!obj.method) {
      obj.method = 'get'
    }
    return obj
  }

  // 封装处理查询参数函数
  const queryString = (obj) => {
    // 判断是否有查询参数
    if (obj.query) {
      // 开始遍历obj.query放到请求地址路径中
      let sun = 0
      for (var k in obj.query) {
        // 识别第一个查询参数
        if (sun === 0) {
          obj.url = obj.url + '?' + k + '=' + obj.query[k]
          sun += 1
        } else {
          // 识别剩下的查询参数
          obj.url = obj.url + '&' + k + '=' + obj.query[k]
        }
      }
      return obj
    }
  }

  // 封装处理处理转化响应数据体函数
  const format = (obj) => {
    if (!obj.format) {
      obj.format = 'json'
    }
    return obj
  }

  // 封装请求体函数
  const requestBody = (body, json) => {
    // 如果有 json 就默认为 json格式数据
    if (json) {
      return JSON.stringify(body)
      // 其他类型数据
    } else if (body) {
      return body
    } else {
      return body
    }
  }

  // 封装处理请求对象函数
  const RequestConfigurationObject = (obj, body) => {
    // 配置 Request() 对象
    let request = {}

    // 判断是否为get,且带了请求体则抛出错误。
    if (obj.method.toLowerCase() === 'get' && body)
      return console.error('get request Cannot carry the request body')

    if (obj.method.toLowerCase() !== 'get' && body) {
      // 不是 gie 请求 且有 body 就添加 body
      request = new Request(obj.url, {
        method: obj.method,
        signal: obj.abortController.signal,
        body: body,
        cache: obj.cache ? obj.cache : 'default',
        credentials: obj.credentials ? obj.credentials : 'same-origin',
        integrity: obj.integrity ? obj.integrity : '',
        keepalive: obj.keepalive ? obj.keepalive : false,
        mode: obj.mode ? obj.mode : 'cors',
        redirect: obj.redirect ? obj.redirect : 'follow',
        referrer: obj.referrer ? obj.referrer : 'about:client',
        referrerPolicy: obj.referrerPolicy ? obj.referrerPolicy : '',
      })
    } else if (
      (obj.method.toLowerCase() !== 'get' && !body) ||
      (obj.method.toLowerCase() === 'get' && !body)
    ) {
      // 不是 gie 请求 没有 body 就不添加 body 或者 是 get请求 没有 body 就不添加 body
      request = new Request(obj.url, {
        method: obj.method,
        signal: obj.abortController.signal,
        cache: obj.cache ? obj.cache : 'default',
        credentials: obj.credentials ? obj.credentials : 'same-origin',
        integrity: obj.integrity ? obj.integrity : '',
        keepalive: obj.keepalive ? obj.keepalive : false,
        mode: obj.mode ? obj.mode : 'cors',
        redirect: obj.redirect ? obj.redirect : 'follow',
        referrer: obj.referrer ? obj.referrer : 'about:client',
        referrerPolicy: obj.referrerPolicy ? obj.referrerPolicy : '',
      })
    }

    // 根据 obj.json 添加 headers 请求头
    if (obj.json) {
      request.headers.set('Content-Type', 'application/json')
    }
    // headers 用于指定请求头, 必须是 `Headers` 对象实例 或 包含字符串格式键/值对的常规对象
    if (obj.header) {
      // 开始遍历 header 为一个数组 成员是数组。
      if (obj.header instanceof Object) {
        for (var k in obj.header) {
          // k为当前属性名 obj为对象 obj[k]为属性值
          request.headers.set(k, obj.header[k])
        }
        // 如果是 headers 对象则直接赋值
      } else if (request.headers instanceof Headers) {
        request.headers = obj.header
      }
    }
    return request
  }

  // 处理配置对象的函数
  const configurationObject = (obj) => {
    // 处理请求方式
    requestMethod(obj)
    // 处理查询字符串
    queryString(obj)
    // 处理转化响应数据体
    format(obj)
    // 处理请求体,不能把 obj 放进去因为 body 转化为json数据再放到 obj 中是乱码。
    const body = requestBody(obj.body, obj.json)
    // 处理请求配置对象
    return RequestConfigurationObject(obj, body)
  }

  // 封装重复请求函数
  const repeatedRequests = (obj, obs) => {
    obs.repeatedRequests = async () => {
      return await becn(obj)
    }
  }

  // 封装fetch请求逻辑函数
  const requestFetch = (request, obj, progress, obs) => {
    return new Promise((resolve, reject) => {
      fetch(request).then(
        async (response) => {
          // 已经得到响应数据就取消超时定时器
          clearTimeout(becn.setTime)
          // 下载进度事件
          if (progress) {
            progress(response)
          }

          // 克隆一个 response
          let responses = response.clone()

          // 转化数据操作
          const body = await responses[obj.format]()
          let data = {}
          for (var k in responses) {
            // k为当前属性名 obj为对象 obj[k]为属性值
            if (
              k !== 'body' &&
              (k === 'headers' ||
                k === 'ok' ||
                k === 'redirected' ||
                k === 'status' ||
                k === 'statusText' ||
                k === 'type' ||
                k === 'url')
            ) {
              data[k] = responses[k]
            }
          }
          data.body = body
          data.response = true

          // 响应成功拦截器
          if (obs && response.ok && obs.responseSucceed) {
            await repeatedRequests(obj, obs)
            const datas = data
            data = null
            data = await obs.responseSucceed(datas)
            if (!data)
              return console.error('Request interceptor need return response')

            // 根据响应状态码 抛出 成功或者错误
            if (data.ok) {
              resolve(data)
            } else {
              resolve(data)
            }
            // 响应失败拦截器
          } else if (obs && !response.ok && obs.responseFailure) {
            await repeatedRequests(obj, obs)
            const datas = data
            data = null
            data = await obs.responseFailure(datas)
            if (!data)
              return console.error('Request interceptor need return response')

            // 根据响应状态码 抛出 成功或者错误
            if (data.ok) {
              resolve(data)
            } else {
              resolve(data)
            }

            // 单独成功请求器
          } else if (response.ok) {
            resolve(data)
            // 单独失败请求器
          } else if (!response.ok) {
            reject(data)
          }
        },
        (err) => {
          // 请求错误也取消定时器
          clearTimeout(becn.setTime)

          // 手动取消请求会触发这里
          // 请求超时,服务器无响应就会自动取消请求会触发这里
          // 违反 cors 策略会触发这里
          // 响应状态码 不是 200~299内的除了 300 有关于重定向的状态码不会自动抛出错误信息，其他状态码会自动抛出错误信息，这里不能接收到。

          // 打印出来的 error 为错误说明
          // 如果没有设置这个错误函数接收到，那么就会在控制台输入错误界别的信息
          // 信息内容和 error 一样都是错误说明
          console.error(err)
          let error = { describe: err + '' }
          // 判断 手动取消请求
          if (error === 'AbortError: The user aborted a request.') {
            error.describe = 'cancelRequest'
            reject(error)
            // 旁段请求超时，服务器无响应。
          } else if (error === 'DOMException: The user aborted a request.') {
            error.describe = 'requestTimeout'
            reject(error)
            // 其他错误
          } else {
            reject(error)
          }
        }
      )
    })
  }

  // 2 根据配置对象url属性来判断此次请求是单独配置的网络请求还是统一配置的网络请求。
  if (!obj.url) {
    // 3 统一配置的网络请求操作
    const obs = async (ob, interrupts, progresss) => {
      // 4 处理 url 地址
      if (obj.baseUrl && ob.url) {
        obj.url = obj.baseUrl + ob.url
      } else if (!obj.baseUrl && ob.url) {
        obj.url = ob.url
      } else if (!ob.url) return console.error('The URL address is empty')

      // 5 处理时间
      if ((!obj.time && ob.time) || (obj.time && ob.time)) {
        obj.time = ob.time
      }

      // 6 处理请求方式
      if ((!obj.method && ob.method) || (obj.method && ob.method)) {
        obj.method = ob.method
      }

      // 7 处理查询参数
      if ((!obj.query && ob.query) || (obj.query && ob.query)) {
        obj.query = ob.query
      }

      // 8 处理请求体
      if ((!obj.body && ob.body) || (obj.body && ob.body)) {
        obj.body = ob.body
      }

      // 9 处理请求体 json
      if ((!obj.json && ob.json) || (obj.json && ob.json)) {
        obj.json = ob.json
      }

      // 10 处理请求头部
      if ((!obj.header && ob.header) || (obj.header && ob.header)) {
        obj.header = ob.header
      }

      // 11 处理请求模式
      if ((!obj.mode && ob.mode) || (obj.mode && ob.mode)) {
        obj.mode = ob.mode
      }

      // 12 处理缓存交互方式
      if ((!obj.cache && ob.cache) || (obj.cache && ob.cache)) {
        obj.cache = ob.cache
      }

      // 13 处理配置coolie处理方式
      if (
        (!obj.credentiais && ob.credentiais) ||
        (obj.credentiais && ob.credentiais)
      ) {
        obj.credentiais = ob.credentiais
      }

      // 14 处理设置默认强制处理子资源
      if ((!obj.integrity && ob.integrity) || (obj.integrity && ob.integrity)) {
        obj.integrity = ob.integrity
      }

      // 15 处理设置默认指示浏览器允许请求存在时间超出页面生命周期
      if ((!obj.keepalive && ob.keepalive) || (obj.keepalive && ob.keepalive)) {
        obj.keepalive = ob.keepalive
      }

      // 16 处理设置默认用于指定如何处理重定向响应函数
      if ((!obj.redirect && ob.redirect) || (obj.redirect && ob.redirect)) {
        obj.redirect = ob.redirect
      }

      // 17 处理设置默认用于指定HTTP的Referer头部的内容
      if ((!obj.referrers && ob.referrers) || (obj.referrers && ob.referrers)) {
        obj.referrers = ob.referrers
      }

      // 18 设置默认的响应数据转换格式
      if ((!obj.format && ob.format) || (obj.format && ob.format)) {
        obj.format = ob.format
      }

      // 19 处理取消指定请求
      if ((!interrupt && interrupts) || (interrupt && interrupts)) {
        interrupt = interrupts
      }

      // 20 处理下载进度
      if ((!progress && progresss) || (progress && progresss)) {
        progress = progresss
      }
      // 21 调用默认处理函数
      let request = configurationObject(obj)

      // 22 请求拦截器
      if (obs.requestInterceptor) {
        // 遍历 request
        for (var k in request) {
          if (
            k === 'url' ||
            k === 'method' ||
            k === 'cache' ||
            k === 'credentials' ||
            k === 'integrity' ||
            k === 'keepalive' ||
            k === 'mode' ||
            k === 'redirect' ||
            k === 'referrer' ||
            k === 'referrerPolicy'
          ) {
            obj[k] = request[k]
          }
        }

        // 先清空配置对象
        request = null

        // 请求拦截器
        const objs = obj
        obj = null
        obj = await obs.requestInterceptor(objs)

        // 如果判断 obj 没有被 return 出就报错提示用户
        if (!obj)
          return console.error('Request interceptor need return request')

        // 重新赋值配置对象
        request = configurationObject(obj)
      }

      // 23 开始请求计时
      requestTime(obj, interrupt, request)

      // 24 调用请求函数发起请求后再抛出响应回来的Promise对象
      return requestFetch(request, obj, progress, obs)
    }
    return obs
  } else if (obj.url) {
    // 3 判断是单独配置的网络请求的操作
    // 4 调用处理配置对象的函数，传入两个参数，第一个是配置对象，第二个是超时函数的实列。
    let request = configurationObject(obj)
    // 5 开始请求计时
    requestTime(obj, interrupt, request)

    // 6 调用请求函数发起请求后再抛出响应回来的 Promise对象
    return requestFetch(request, obj, progress)
  }
}
export default becn
