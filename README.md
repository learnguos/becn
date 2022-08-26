## Becn

- 简介：基于 `Fetch API` 实现的网络请求库


- 功能：单独配置的网络请求、统一配置的网络请求、请求拦截器、响应拦截器...
- 实现原理机制：发起请求时 `becn`网络请求库内部会接收调用 `becn()` 时的实参，在 `becn` 内部接收这些参数，每个参数都有一个不同的函数去处理，当参数处理完成后，才会生成一个 `Request` 对象， `fetch` 执行时，传入这个 `Request` 对象，真正的发起请求。请求任务完成后，在 `then()` 中接收一个 `Response`  对象，这个对象描述了响应回来的数据，经过一些处理后 `Response`  对象最终成为 `Promise`  对象，并抛出由 `fetchs()` 返回。
- 浏览器兼容性：https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch
- 支持 `promise` 语法糖 或 `async/await`
- 暂不支持 `node.js`

## 安装

- **npm 安装**

  ```
  npm i becn --save
  ```

- **cdn 安装**

  ```
  <script src="https://cdn.jsdelivr.net/npm/becn/becn.min.js"></script>
  ```

## 使用

- **使用方式一**

  ```javascript
  // 1 导入 becn
  import becn from 'becn'
  
  // 2 使用 becn 进行一个简单的请求, url 为请求的地址，不指定请求方式默认为 get 请求。
  // 2.1 返回的是一个 promise 实列对象
  const uu = becn({
    url: `http://jsonplaceholder.typicode.com/comments`,
  })
  
  uu.then((response) => {
    // 3 请求成功(响应状态码在200~299以内)则打印成功的 Response 对象
    // Response 对象 包含了此次成功响应相关的数据。
    console.log(response)
  }).catch((error) => {
    // 4 请求失败(响应状态码在200~299以外)则打印失败的 Response 对象
    // error 对象 包含了此次失败响应相关的数据。
    console.log(error)
  })
  ```

- **使用方式二**

  ```javascript
  // 1 导入 becn
  import becn from 'becn'
  
  // 2 使用 becn 进行一个简单的请求, baseUrl 为基础 url 地址。
  const ff = becn({ baseUrl: 'http://jsonplaceholder.typicode.com/' })
  
  // 3 使用 becn 进行一个简单的请求
  // 3.1 返回的是一个 promise 对象
  const uu = ff({
    url: `posts/2`,
  })
  
  uu.then((response) => {
    // 4 请求成功(响应状态码在200~299以内)则打印成功的 Response 对象
    // Response 对象 包含了此次成功响应相关的数据。
    console.log(response)
  }).catch((error) => {
    // 5 请求失败(响应状态码在200~299以外)则打印失败的 Response 对象
    // error 对象 包含了此次失败响应相关的数据。
    console.log(error)
  })
  ```

## 配置对象

- **什么是配置对象？**

  - 配置对象 就是当前的请求参数的集合，根据设置不同的请求参数发起请求时， `becn`内部自动把这些参数传入到生成的 `Request` 请求对象中，实现了使用请求体的不同方式。

  - 下面的请求中，配置对象就有一个基本的请求参数： `url参数` 

    ```js
     const uu = becn({
        url: `http://jsonplaceholder.typicode.com/comments`
      })
    ```
    
  - 配置对象的优先级

    ```js
    // 1 导入 becn
    import becn from 'becn'
    
    // 2 使用 becn 进行一个简单的请求, baseUrl 为基础 url 地址。
    // time 参数 设置此次请求的超时时间，超过这个时间，如果请求还没有响应，就会自动取消请求。
    const ff = becn({ baseUrl: 'http://jsonplaceholder.typicode.com/',time: 3000 })
    
    // 3 使用 becn 进行一个简单的请求
    // 3.1 返回的是一个 promise 对象
    // 此时的 time 参数优先级会高于 上面的 time 参数，也就是说有两个 time 时 只有这里的 time 才生效
    // 其他参数也是如此
    const uu = ff({
      url: `posts/2`,
      time: 5000
    })
    
    uu.then((response) => {
      // 4 请求成功(响应状态码在200~299以内)则打印成功的 Response 对象
      // Response 对象 包含了此次成功响应相关的数据。
      console.log(response)
    }).catch((error) => {
      // 5 请求失败(响应状态码在200~299以外)则打印失败的 Response 对象
      // error 对象 包含了此次失败响应相关的数据。
      console.log(error)
    })
    ```

  - 在所有的配置对象中，除了 `url` 参数是必须要写的，其他参数都是可以根据接口要求自定义配置。

    

- **url 参数**

  - 说明：用于指定网络资源url地址

  - 值的数据类型：`string`

  - 默认值：无

  - 可选值：无

  - 注意点：此参数在使用方式一是必须填的，如果不填就会被认为是使用方式二请求。

  - 示列

    ```js
     const uu = becn({
        url: 'http://jsonplaceholder.typicode.com/comments'
      })
    ```

- **baseUrl 参数**

  - 说明：基础 `url` 地址，只限于使用方式二中使用。

  - 值的数据类型：`string`

  - 默认值：无

  - 可选值：无

  - 注意点：无

  - 示列

    ```js
    // 定义基础 urk 地址
    const uu = becn({
        baseUrl: 'http://jsonplaceholder.typicode.com'
      })
    
    // 发送请求
     const uus = uu({
        Url: '/comments'
      })
    ```

- **method 参数**

  - 说明：用于指定 `HTTP` 请求的方式

  - 值的数据类型：`string`

  - 默认值：`GET`

  - 可选值：`GET` `PUT` `PATCH` `DELETE` `HEAD` `OPTIONS` `CONNECT` `TARCE`

  - 注意点: 

    - `GET` 请求不能携带请求体，否者会报错

  - 示列

    ```js
     const uu = becn({
        url: 'http://jsonplaceholder.typicode.com/comments',
        method: 'POST'
      })
    ```

- **body 参数**

  - 说明：指定使用请求体时请求体的内容

  - 值的数据类型：`Blob` `BufferSource` `FormData` `String` `URLSearchParams` `ReadableStream`  

  - 默认值：无

  - 可选值：无

  - 注意点：

    - `json` 参数 和 `body` 参数只能二选一，如果两个都存在则默认发送 `json` 参数。
    - 如果没有指定请求头键值对，浏览器自动添加： `Content-Type: text/plain;charset=UTF-8`

  - 示列

    ```js
     const uu = becn({
        url: 'http://jsonplaceholder.typicode.com/comments',
        body: '我发送了String数据类型的请求体'
      })
    ```

- **json 参数**

  - 说明：指定使用请求体时请求体的内容,并自动将请求体的内容转化成 `json` 格式，添加对应的请求头。

  - 值的数据类型：`Srting` `Number` `Boolean` `null` `Object` `Array`

  - 默认值：无

  - 可选值：无

  - 注意点:

    - `json` 参数 和 `body` 参数只能二选一，如果两个都存在则默认发送 `json` 参数。
    - 浏览器自动添加： `Content-Type: application/json`

  - 示列

    ```js
     const uu = becn({
        url: 'http://jsonplaceholder.typicode.com/comments',
        json: { yy: '我发送了json格式类型的请求体' }
      })
    ```

- **format 参数**

  - 说明：指定响应回来的数据是以哪种 `JavaScript` 对象类型被接收

  - 值的数据类型：`Srting` 

  - 默认值：`json`

  - 可选值：

    1. `text` 
       - 将接收到的响应数据转化为 `UTF-8` 格式字符串  
    2. `json`  
       - 会把接收到的响应数据认为是 `json` 格式的数据，并反序列化转化为 `javascript` 数据。
    3. `formData`
       - 将接收到的响应数据转化为 `formData` 对象
    4. `arrayBuffer`  
       - 将接收到的响应数据转化为原始二进制格式
    5. `blob`
       - 将接收到的响应数据转化为 `blob` 对象

  - 注意点：无

  - 示列

    ```js
     const uu = becn({
        url: 'http://jsonplaceholder.typicode.com/comments',
        format: 'text'
      })
    ```

- **time 参数**

  - 说明：指定请求超时时间

  - 值的数据类型：`Number`

  - 默认值：`2500`

  - 可选值：无

  - 注意点：无

  - 示列

    ```js
     const uu = becn({
        url: 'http://jsonplaceholder.typicode.com/comments',
        time: 1000
      })
    ```

- **header 参数**

  - 说明：用于指定请求头, 必须是 `Headers` 对象实例 或 包含字符串格式的 键/值 对的常规对象  

  - 值的数据类型：`Object`

  - 默认值：无

  - 可选值：无

  - 注意点：无论是否设置 `headers` 属性浏览器仍然会随请求发送一些头部。虽然这些头部对 `JavaScript` 不可见，但浏览器的网络检查器可以观察到 。

  - 示列一

    ```js
     const uu = becn({
        url: 'http://jsonplaceholder.typicode.com/comments',
        header: { 'Content-Type': 'application/json' }
      })
    ```

  - 示列二

    ```js
    let h = new Headers()
    h.set('Content-Type', 'application/json')
    
    const uu = becn({
      url: 'http://jsonplaceholder.typicode.com/comments',
      headers: h
    })
    ```

- **cache 参数**

  - 说明：用户控制浏览器与 `HTTP` 缓存的交互   

  - 值的数据类型：`string`

  - 默认值：`default` 

  - 可选值：

    1. `default` 
       - 返回命中的有效缓存。不发送请求  
       - 命中无效（ stale）缓存会发送条件式请求。如果响应已经改变，则更新缓存的值。然后
         返回缓存的值  
       - 未命中缓存会发送请求，并缓存响应。然后 `becn` 返回响应  
    2. `no-store` 
       - 浏览器不检查缓存，直接发送请求  
       - 不缓存响应，直接返回 。
    3. `reload`  
       - 浏览器不检查缓存，直接发送请求  
       - 缓存响应，再通过 `becn` 返回 。
    4. `no-cache`  
       - 无论命中有效缓存还是无效缓存都会发送条件式请求。如果响应已经改变，则更新缓存的值。然
         后返回缓存的值  
       - 未命中缓存会发送请求，并缓存响应，然后返回响应 。
    5. `force-cache` 
       - 无论命中有效缓存还是无效缓存都通过 `becn` 返回，不发送请求。  
       - 未命中缓存会发送请求，并缓存响应，然后返回响应。
    6. `only-if-cached`  
       - 只在请求模式为 same-origin 时使用缓存  
       - 无论命中有效缓存还是无效缓存都通过 `becn` 返回, 不发送请求。 
       - 未命中缓存返回状态码为 504（网关超时）的响应  

  - 注意点：无

  - 示列

    ```js
     const uu = becn({
        url: 'http://jsonplaceholder.typicode.com/comments',
        cache: 'no-store'
      })
    ```

- **credentials 参数**

  - 说明：用于指定在请求中如何包含 `cookie`

  - 值的数据类型：`string`

  - 默认值：`same-origin`  

  - 可选值：

    1. `omit` 
       - 不发送 `cookie`  
    2. `same-origin` 
       - 请求的 `url` 地址 与发送请求的页面同源时才发送 `cookie`   
    3. `include`  
       - 在 支持 `Credential Management API` 的浏 览 器 中 ， 也 可以 是 一个 `FederatedCredential` 或
         `PasswordCredential` 的实例   

  - 注意点：无

  - 示列

    ```js
     const uu = becn({
        url: 'http://jsonplaceholder.typicode.com/comments',
        cache: 'no-store'
      })
    ```

- **integrity 参数**

  - 说明：用于验证子资源完整性，必须是包含子资源完整性标识符的字符串 ，等同于 `script` 标签的 `integrity` 属性。

  - 值的数据类型：`string`

  - 默认值：空字符串

  - 可选值：无

  - 注意点：当响应回来的资源被截取串改，此参数就会生效，阻止响应数据被接收。

  - 示列

    ```js
     const uu = becn({
        url: 'https://cdn.jsdelivr.net/npm/jscy@1.0.0/jscy.min.js',
        integrity: 'sha384-7TWe9R6519ilq4X5HYOi4mFcltIjy0hlllzOqgKvysP3PdhPK2G1XCIGm6z8myUY'
      })
    ```

- **keepalive 参数**

  - 说明：用于指示浏览器允许请求存在时间超出页面生命周期。适合报告事件或分析，比如页面在请求后很快卸载。设置 `keepalive` 参数的请求可用于替代 `Navigator.sendBeacon()`  

  - 值的数据类型：`Boolean`

  - 默认值：`false`

  - 可选值：`false`  `true`  

  - 注意点：无

  - 示列

    ```js
     const uu = becn({
        url: 'http://jsonplaceholder.typicode.com/comments',
        keepalive: true
      })
    ```

- **mode 参数**

  - 说明：用于指定请求模式,这个模式决定来自跨源请求的响应是否有效，以及客户端可以读取多少响应。
    违反这里指定模式的请求会抛出错误 。

  - 值的数据类型：`string`

  - 默认值：`cors`

  - 可选值：

    1. `cors`
       - 允许遵守 CORS 协议的跨源请求。响应是“CORS 过滤的响应”，意思是响应中可以访问
         的浏览器头部是经过浏览器强制白名单过滤的 。
    2. `no-cors`
       - 允许不需要发送预检请求的跨源请求（ HEAD、 GET 和只带有满足 CORS 请求头部的
         POST）。响应类型是 opaque，意思是不能读取响应内容  
    3. `same-origin`  
       - 任何跨源请求都不允许发送  
    4. `navigate`  
       - 用于支持 HTML 导航，只在文档间导航时使用。基本用不到 

  - 注意点：无

  - 示列

    ```js
     const uu = becn({
        url: 'http://jsonplaceholder.typicode.com/comments',
        mode: 'same-origin'
      })
    ```

- **redirect 参数**

  - 说明：用于指定如何处理重定向响应（状态码为 301、 302、 303、 307 或 308）

  - 值的数据类型：`string`

  - 默认值：`follow`

  - 可选值：

    1. `follow`
       - 跟踪重定向请求，以最终非重定向 URL 的响应作为最终响应    
    2. `error`
       - 重定向请求会抛出错误   
    3. `manual`  
       - 不跟踪重定向请求，而是返回 `opaqueredirect` 类型的响应，同时仍然暴露期望的重
         定向 `URL`。允许以手动方式跟踪重定向 

  - 注意点：无

  - 示列

    ```js
     const uu = becn({
        url: 'http://jsonplaceholder.typicode.com/comments',
        redirect: 'error'
      })
    ```

- **referrer 参数**

  - 说明：用于指定 `HTTP` 的 `Referer` 头部的内容

  - 值的数据类型：`string`

  - 默认值：`about:client`

  - 可选值：

    1. `no-referrer`
       - 以 no-referrer 作为值     
    2. `about:client`
       - 以当前 `URL` 或 `no-referrer`（取决于来源策略 referrerPolicy）作
         为值    
    3. `<URL>`  
       - 以伪造 `URL` 作为值。伪造 `URL` 的源必须与执行脚本的源匹配 

  - 注意点：无

  - 示列

    ```js
     const uu = becn({
        url: 'http://jsonplaceholder.typicode.com/comments',
        referrer: 'no-referrer'
      })
    ```

- **referrerPolicy 参数**

  - 说明：用于指定 `HTTP` 的 `Referer` 头部

  - 值的数据类型：`string`

  - 默认值：空字符串

  - 可选值：

    1. `no-referrer`
       - 请求中不包含 Referer 头部       
    2. `no-referrer-when-downgrade`
       - 对于从安全 HTTPS 上下文发送到 HTTP URL 的请求，不包含 Referer 头部  
       - 对于所有其他请求，将 Referer 设置为完整 URL    
    3. `origin` 
       - 对于所有请求，将 Referer 设置为只包含源  
    4. `same-origin`  
       - 对于跨源请求，不包含 Referer 头部  
       - 对于同源请求，将 Referer 设置为完整 URL  
    5. `strict-origin`  
       - 对于从安全 HTTPS 上下文发送到 HTTP URL 的请求，不包含 Referer 头部  
       - 对于所有其他请求，将 Referer 设置为只包含源  
    6. `origin-when-cross-origin`  
       - 对于跨源请求，将 Referer 设置为只包含源  
       - 对于同源请求，将 Referer 设置为完整 URL  
    7. `strict-origin-when-cross-origin` 
       -  对于从安全 HTTPS 上下文发送到 HTTP URL 的请求，不包含 Referer 头部  
       -  对于所有其他跨源请求，将 Referer 设置为只包含源  
       -  对于同源请求，将 Referer 设置为完整 URL  
    8. `unsafe-url`  
       - 对于所有请求，将 Referer 设置为完整 URL  

  - 注意点：无

  - 示列

    ```js
     const uu = becn({
        url: 'http://jsonplaceholder.typicode.com/comments',
        referrerPolicy: 'same-origin'
      })
    ```

## 请求拦截器

- 在请求拦截器中，你可以在请求前处理请求的配置对象 `Request`

- 在请求拦截器中，你可以在请求前使用 `becn` 进行其他的请求。

- 请求拦截器只能在使用方式二中使用

- 示列代码

  ```js
  // 导入 becn
  import becn from 'becn'
  
  // 配置基础地址
  const ff = becn({ baseUrl: 'http://jsonplaceholder.typicode.com/' })
  
  // 请求拦截器
  ff.requestInterceptor = async (request) => {
    // 修改 request 配置对象 的 header 参数
    request.header.dfsdfs = '6666'
    console.log(request)
  
    // 请求前发起另外一个请求
    try {
      const bb = await becn({
        url: `http://jsonplaceholder.typicode.com/comments`,
      })
      console.log(bb)
    } catch (error) {
      console.log(error)
    }
  
    // 这里一定要 return 出去 request 配置对象
    return request
  }
  
  // 发起请求
  const uu = ff({
    url: `posts/2`,
    header: { 'Content-Type': 'application/json', dfsdfs: 'dsfsd' },
  })
  
  // 响应
  uu.then((response) => {
    console.log(response)
  }).catch((error) => {
    console.log(error)
  })
  ```


## 响应成功拦截器

- 设置了响应成功拦截器只有在当前请求的响应状态码 `(200~299)之间` 会触发。

- 在响应成功拦截器中，你可以获取到响应对象 `Request`并处理它，包含了此次响应相关的数据。

- `Request` 响应对象的属性

  | 属性       | 说明                                                         |
  | ---------- | ------------------------------------------------------------ |
  | body       | 已自动转化的响应体数据                                       |
  | headers    | 响应回来的 Headers 对象                                      |
  | ok         | 属性值为 true 时表示响应状态码为 200到299，属性值为 false 时表示响应状态码为 200到299 以外。 |
  | redirected | 布尔值，表示响应是否至少经过一次重定向  ，当为 true 时，返回的状态码仍然是 200，而不是不是 300到399。 |
  | status     | 表示响应的 HTTP 状态码                                       |
  | statusText | 字符串，包含对 HTTP 状态码的正式描述。这个值派生自可选的 HTTP Reason-Phrase 字段，因此如果服<br/>务器以 Reason-Phrase 为由拒绝响应，这个字段可能是空字符串 |
  | type       | 表示响应类型，basic：表示标准的同源响应   cors：表示标准的跨源响应   error：表示响应对象是通过 Response.error()创建的   opaque：表示 no-cors 的 fetch()返回的跨源响应   opaqueredirect：表示对 redirect 设置为 manual 的请求的响应。 |
  | url        | 包含响应 URL 的字符串。对于重定向响应，这是最终的 URL，非重定向响应就是它产生的 |
  
- 在响应成功拦截器中，你可以在请求前使用 `becn` 进行其他的请求。

- 响应成功拦截器只能在使用方式二中使用。

- 示列代码

  ```js
  // 导入 becn
  import becn from 'becn'
  
  // 配置基础地址
  const ff = becn({ baseUrl: 'http://jsonplaceholder.typicode.com/' })
  
  // 响应成功拦截器
  ff.responseSucceed = async (request) => {
    // 发起另外一个请求
    try {
      const bb = await becn({
        url: `http://jsonplaceholder.typicode.com/comments`,
      })
      console.log(bb)
    } catch (error) {
      console.log(error)
    }
  
    // 重复本次请求
    try {
      const bb = await ff.repeatedRequests()
      console.log(bb)
    } catch (error) {
      console.log(error)
    }
  
    // 简化响应体数据
    // 如果把 request.ok 设置为 fasle，当前请求会抛出错误的响应对象，而不是成功的响应对象
    request = request.body
  
    // 这里一定要 return 出去 request 响应对象
    return request
  }
  
  // 发起请求
  const uu = ff({
    url: `posts/2`,
    header: { 'Content-Type': 'application/json', dfsdfs: 'dsfsd' },
  })
  
  // 响应
  uu.then((response) => {
    console.log('成功的响应对象')
    console.log(response)
  }).catch((error) => {
    console.log('失败的响应对象')
    console.log(error)
  })
  ```

## 响应失败拦截器

- 设置了响应失败拦截器只有在当前请求的响应状态码 `200到299 之外` 会触发。

- 在响应失败拦截器中，你可以获取到响应对象 `Request`并处理它，包含了此次响应相关的数据。

- `Request` 响应对象的属性

  | 属性       | 说明                                                         |
  | ---------- | ------------------------------------------------------------ |
  | body       | 已自动转化的响应体数据                                       |
  | headers    | 响应回来的 Headers 对象                                      |
  | ok         | 属性值为 true 时表示响应状态码为 200~299，属性值为 false 时表示响应状态码为 200~299 以外。 |
  | redirected | 布尔值，表示响应是否至少经过一次重定向  ，当为 true 时，返回的状态码仍然是 200，而不是不是 300~399。 |
  | status     | 表示响应的 HTTP 状态码                                       |
  | statusText | 字符串，包含对 HTTP 状态码的正式描述。这个值派生自可选的 HTTP Reason-Phrase 字段，因此如果服<br/>务器以 Reason-Phrase 为由拒绝响应，这个字段可能是空字符串 |
  | type       | 表示响应类型，basic：表示标准的同源响应   cors：表示标准的跨源响应   error：表示响应对象是通过 Response.error()创建的   opaque：表示 no-cors 的 fetch()返回的跨源响应   opaqueredirect：表示对 redirect 设置为 manual 的请求的响应。 |
  | url        | 包含响应 URL 的字符串。对于重定向响应，这是最终的 URL，非重定向响应就是它产生的 |

- 在响应失败拦截器中，你可以在请求前使用 `becn` 进行其他的请求。

- 响应失败拦截器只能在使用方式二中使用。

- 示列代码

  ```js
  // 导入 becn
  import becn from 'becn'
  
  // 配置基础地址
  const ff = becn({ baseUrl: 'http://jsonplaceholder.typicode.com/' })
  
  // 响应失败拦截器
  ff.responseFailure = async (request) => {
    // 发起另外一个请求
    try {
      const bb = await becn({
        url: `http://jsonplaceholder.typicode.com/comments`,
      })
      console.log(bb)
    } catch (error) {
      console.log(error)
    }
  
    // 重复本次请求
    try {
      const bb = await ff.repeatedRequests()
      console.log(bb)
    } catch (error) {
      console.log(error)
    }
  
    // 如果把 request.ok 设置为 true，当前请求会抛出成功的响应对象，而不是失败的响应对象。
    request.ok = !request.ok
  
    // 这里一定要 return 出去 request 响应对象
    return request
  }
  
  // 发起请求
  const uu = ff({
    url: `posts/2/1`,
    header: { 'Content-Type': 'application/json', dfsdfs: 'dsfsd' },
  })
  
  // 响应
  uu.then((response) => {
    console.log('成功的响应对象')
    console.log(response)
  }).catch((error) => {
    console.log('失败的响应对象')
    console.log(error)
  })
  ```

## 取消请求

- **在方式一中的取消请求优先级高于在方式二中的取消请求**

- **取消当前的网络请求**

  ```js
  // 导入 becn
  import becn from './becn.js'
  
  // 配置基础地址
  const ff = becn({ baseUrl: 'http://jsonplaceholder.typicode.com/' })
  
  // 发起请求
  const uu = ff({
    url: `posts/2`,
    header: { 'Content-Type': 'application/json', dfsdfs: 'dsfsd' },
  })
  
  // 取消请求
  becn.cancelRequest()
  
  // 响应
  uu.then((response) => {
    console.log('成功的响应对象')
    console.log(response)
  }).catch((error) => {
    console.log('失败的响应对象')
    console.log(error)
  })
  ```

- **取消指定的网络请求**

  ```js
  // 导入 becn
  import becn from 'becn'
  
  // 取消指定请求 1
  let ss = []
  
  // 发起请求
  const uus = becn({ url: 'http://jsonplaceholder.typicode.com/posts/2' }, ss)
  
  // 发起请求
  const uu = becn({ url: 'http://jsonplaceholder.typicode.com/posts/2' })
  
  // 取消指定请求 2
  ss[0].cancelRequest()
  ss = []
  
  // 响应
  uu.then((response) => {
    console.log('成功的响应对象1')
    console.log(response)
  }).catch((error) => {
    console.log('失败的响应对象1')
    console.log(error)
  })
  
  // 响应
  uus
    .then((response) => {
      console.log('成功的响应对象2')
      console.log(response)
    })
    .catch((error) => {
      console.log('失败的响应对象2')
      console.log(error)
    })
  ```

- **取消多个指定的网络请求**

  ```js
  // 导入 becn
  import becn from './becn.js'
  
  // 取消多个指定请求 1
  let ss = []
  
  // 发起请求
  const uus = becn({ url: 'http://jsonplaceholder.typicode.com/posts/2' }, ss)
  
  // 发起请求
  const uu = becn({ url: 'http://jsonplaceholder.typicode.com/posts/2' }, ss)
  
  // 取消多个指定请求 2
  ss.forEach((value, index, array) => {
    value.cancelRequest()
  })
  ss = []
  
  // 响应
  uu.then((response) => {
    console.log('成功的响应对象1')
    console.log(response)
  }).catch((error) => {
    console.log('失败的响应对象1')
    console.log(error)
  })
  
  // 响应
  uus
    .then((response) => {
      console.log('成功的响应对象2')
      console.log(response)
    })
    .catch((error) => {
      console.log('失败的响应对象2')
      console.log(error)
    })
  ```

## 实时读取数据

- 从 `TCP/IP` 角度来看，传输的数据是以分块形式抵达端点的，而且速度受到网速的限制。接收端点
  会为此分配内存，并将收到的块写入内存。 `Fetch API` 通过 `ReadableStream` 支持在这些块到达时就实
  时读取和操作这些数据。  

- `becn` 提供了一个回调函数去操作这些功能

- 示列代码

  ```js
  // 导入 becn
  import becn from 'becn'
  
  // 实时读取数据
  const ff = async (response) => {
    // 1. 创建 TextDecoder() 将数据块转换为字符串
    let decoder = new TextDecoder()
    // 2 读写流操作，不懂得可以查看 Streams API
    const reader = response.clone().body.getReader()
    // 3 获取数据块
    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        break
      } else {
        // 4 打印数据块
        // console.log(value)
        // 5 打印转化为字符串的数据块
        console.log(decoder.decode(value, { stream: true }))
      }
    }
  }
  
  // 发起请求
  const uu = becn(
    {
      url: `https://fetch.spec.whatwg.org/`,
      format: 'text',
      time: 7000,
    },
    null,
    ff
  )
  
  // 响应
  uu.then((response) => {
    console.log(response)
  }).catch((error) => {
    console.log(error)
  })
  ```

## 下载进度

- 实现下载进度的前提是服务器必须响应一个请求头来标识当前响应资源的总大小

- 示列代码

  ```js
  // 导入 becn
  import becn from './becn.js'
  
  // 实时读取数据
  const ff = async (response) => {
    // 1
    if (
      response.headers.has('Content-Length') &&
      response.headers.get('Content-Length') - 0 > 0
    ) {
      // 2 设置一个变量存放实时接收得数据大小,默认进度为0。
      const length = response.headers.get('Content-Length') - 0
      let dd = 0
      console.log(dd + '%')
  
      // 2 读写流操作，不懂得可以看 Streams API
      const reader = response.clone().body.getReader()
  
      // 3 获取数据块
      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          break
        } else {
          // 4 根据获取得数据块 value.length 属性获取大小实时计算下载进度。
          // 4.1 先保存原来得值
          const yy = Math.floor(dd)
          // 5 最新得值
          dd += (value.length / length) * 100
          const yys = Math.floor(dd)
          // 6 开始实时计算下载进度
          if (yys > 0) {
            if (yys !== yy) {
              console.log(yys + '%')
            }
          }
        }
      }
    }
  }
  
  // 发起请求
  const uu = becn(
    {
      url: `https://img-blog.csdnimg.cn/20211003153321817.gif`,
      format: 'blob',
      time: 7000,
    },
    null,
    ff
  )
  
  // 响应
  uu.then((response) => {
    console.log(response)
  }).catch((error) => {
    console.log(error)
  })
  ```

## 上传进度

- 目前 `Fetch Api` 没有提供上传进度的接口或方法
- 文件较小的可以直接从 0 到 100 的进度
- 文件较大的采用分片上传
- 或使用 `XMLHttpRequest` 

## 错误处理

```js
// 导入 becn
import becn from 'becn'

// 发起请求
const uu = becn({
  url: `http://jsonplaceholder.typicode.com/comments`,
})

// 响应
uu.then((response) => {
  // 请求成功(响应状态码在200~299以内)则打印成功的 Response 对象
  // Response 对象 包含了此次成功响应相关的数据。
  console.log(response)
}).catch((error) => {
  // 请求失败(响应状态码在200~299以外)则打印失败的 error 对象
  // error 对象 包含了此次失败响应相关的数据。

  if (error.response) {
    // 服务器响应回来的数据 响应状态码在200~299以外
    console.log(error)
  } else if (error.describe === 'cancelRequest') {
    // 服务器没有响应回来数据，因为手动取消了请求。
    console.log(error)
  } else if (error.describe === 'requestTimeout') {
    // 服务器没有响应回来数据，因为请求已经超时。
    console.log(error)
  } else {
    // 其他错误
    console.log(error)
  }
})
```





