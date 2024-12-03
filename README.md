<h1  align="center"  style="border-bottom: none;">
📦 Stash
</h1>

<img src="logo.png" style="border-bottom: none; 
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 50%;">

<h3  align="center">A lightweight and fast file upload server built with Bun runtime that supports file uploads and downloads. </h3>

<br  />

<p  align="center">

<a  href="https://github.com/BRAVO68WEB/stash/actions/workflows/ci.yaml">
<img  alt="Build states"  src="https://github.com/BRAVO68WEB/stash/actions/workflows/ci.yaml/badge.svg?branch=main">
</a>

<p  align="center">
<a  href="https://github.com/BRAVO68WEB/stash/issues/new">Bug report</a>
</p>

<hr  />

## Features 🚀

- File upload via PUT requests
- File download via GET requests
- 2GB file size limit
- Timestamp-based unique file naming
- Simple wget-compatible download links
- No external dependencies
- Fast and lightweight
- Easy to deploy
- Cross-platform
- Resumable downloads

## Prerequisites 🔗

- [Bun](https://bun.sh) runtime installed

## Installation ⚙

1. Clone the repository
2. Install dependencies:

```bash
bun install
```

3. Run the server:

```bash
bun dev
```

## Usage 🙌

### File Upload

```bash
curl -T <file> http://localhost:9988/<file>
```

### File Download

```bash
wget http://localhost:9988/<file>
```

## License 📑

This project is licensed under the GPL V3 License - see the [LICENSE](LICENSE) file for details.
