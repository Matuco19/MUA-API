# MSA API

MSA API (Matuco19 System API) is a multi-purpose API developed in Node.js that offers a variety of services through a simple and easy-to-use interface. The API is designed to be a versatile tool for developers, providing a range of functionalities that can be integrated into any project.

---

## Table of Contents

- [MSA API](#msa-api)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [API Endpoint](#api-endpoint)
    - [Screenshot](#screenshot)
    - [About](#about)
    - [Analyze Sentiment](#analyze-sentiment)
    - [CORS Proxy](#cors-proxy)
  - [Developer Information](#developer-information)
  - [License](#license)

---

## Installation

To get started, clone the repository and install the dependencies:

```bash
git clone https://github.com/Matuco19/MSA-Api
cd MSA-Api
npm install
```

---

## Usage

> [!NOTE]
> This project uses `fetch` at runtime; ensure Node >= 18 or install `node-fetch` if running a lower Node version.

To start the server, run the following command:

```bash
npm start
```

The server will start on `http://localhost:3000`.

---

## API Endpoint

### Screenshot

- **URL**: `/screenshot`
- **Method**: `GET`
- **Query Parameters**:
  - `url`: The URL of the website you want to capture.
  
**Example**: `/api/screenshot/?url=https://matuco19.com`

**Example Response**:

The response will be a screenshot of the provided URL in PNG format.

### About

- **URL**: `/about`
- **Method**: `GET`
- **Query Parameters**:
  - `None`: No query parameters required.

**Example**: `/api/about`

**Example Response**:

The response will be stats of the API

### Analyze Sentiment

- **URL**: `/analyze-sentiment`
- **Method**: `GET`
- **Query Parameters**:
  - `text`: Text to analyze the sentiment.

**Example**: `/api/analyze-sentiment/?text="hello world!"`

**Example Response**:

The response will be a dictionary with `sentiment` and `polarity` keys, like:

```json
{
  "sentiment": "positive",
  "polarity": 0.666666666666667
}
```

### CORS Proxy

- **URL**: `/cors-proxy`
- **Method**: `GET`
- **Query Parameters**:
  - `url` (required): The remote URL to fetch.
  - `raw` (optional): `true` or `1` to return the raw response with original content-type; otherwise the proxy returns a JSON object with `contents` and `status` fields (similar to AllOrigins).
  - `timeout` (optional): Request timeout in milliseconds (default 10000, min 3000).
  - `cache_ttl` (optional): Seconds to cache the result (default 60).

**Examples**:

- JSON output (default): `/api/cors-proxy?url=https://example.com`
- Raw output (forwarded content): `/api/cors-proxy?url=https://example.com/image.png&raw=1`

The `cors-proxy` endpoint sets `Access-Control-Allow-Origin: *` and supports streaming of binary resources while also respecting timeouts and content-size limits.

**Example Response**:

if raw mode is not enabled, the endpoint will return a discretionary with the items `contents` and `status`, like this:

```json
{
  "contents": "html content here",
  "status": {
    "http_code": 200,
    "content_type": "text/html; charset=UTF-8"
  }
}
```

---

## Developer Information

This project is developed and maintained by **Matuco19**.

- Matuco19 Website: [matuco19.com](https://matuco19.com)  
- GitHub: [github.com/Matuco19](https://github.com/Matuco19)
- Discord Server: [discord.gg/Matuco19Server0](https://discord.gg/hp7yCxHJBw)

---

## License

![License-MATCO Open Source V1](https://img.shields.io/badge/License-MATCO_Open_Source_V1-blue.svg)

This project is open-source and available under the [MATCO-Open-Source License](https://matuco19.com/licenses/MATCO-Open-Source). See the `LICENSE` file for details.
