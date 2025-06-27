# react-ipdf-viewer-lite

![npm](https://img.shields.io/npm/v/react-ipdf-viewer-lite)
![license](https://img.shields.io/npm/l/react-ipdf-viewer-lite)
![downloads](https://img.shields.io/npm/dm/react-ipdf-viewer-lite)
![types](https://img.shields.io/npm/types/react-ipdf-viewer-lite)

A React component for viewing PDF documents using Mozilla's `pdf.js`. Embed a customizable PDF viewer in your React applications with page zoom, theme, Full Screen, Page Count and download support.

## Features

- Render PDFs from URLs or local files with smooth navigation.
- Enable zoom download and full-screen via toolbar.
- Support light and dark themes for accessibility.
- Compatible with modern browsers (Chrome, Firefox, Safari, Edge).
- Built-in zoom and navigation controls.
- TypeScript-compatible for type-safe development.

## Installation

Install the package via npm:

```bash
npm install react-ipdf-viewer-lite
```

Or using Yarn:

```bash
yarn add react-ipdf-viewer-lite
```

## Demo

Explore a live demo of `react-ipdf-viewer-lite` in action:

- [Live Demo](https://react-ipdf-viewer-demo.vercel.app/)

See the PDF viewer with zoom, navigation, and theme support directly in your browser.

### Dependencies

Ensure you have the following peer dependencies installed:

- `react` (>=16.8.0)
- `react-dom` (>=16.8.0)
- `pdfjs-dist` (>=2.9.359)

Install them if needed:

```bash
npm install react react-dom pdfjs-dist
```

## Usage

Import the `ReactIPdfViewerLite` component and provide a PDF file URL or path via the `src` prop. The component supports PDF documents only; place local PDFs in your `public/` folder or use a hosted URL.

### Example: Viewing a PDF

```jsx
import React from "react";
import { ReactIPdfViewerLite } from "react-ipdf-viewer-lite";
import "./App.css";

const PDF = "sample.pdf";

const App = () => {
  return (
    <div className="App">
      <ReactIPdfViewerLite src={PDF} theme='light'/>
    </div>
  );
};

export default App;
```

## API

### `ReactIPdfViewerLite`

A React component to render a PDF viewer with customizable controls.

#### Props

| Prop              | Type      | Description                                                               | Default   | Example                                              |
| ----------------- | --------- | ------------------------------------------------------------------------- | --------- | ---------------------------------------------------- |
| `src`             | `string`  | URL or path to the PDF file to render. Also accepts `document={{ url }}`. | None      | `'sample.pdf'` or `'https://example.com/sample.pdf'` |
| `theme`           | `string`  | Sets the viewer’s theme. Options: `'light'`, `'dark'`.                    | `'dark'` | `'light'` |


## Error Handling and Troubleshooting

The `ReactIPdfViewerLite` component may encounter issues when loading or rendering PDFs. Below are common errors and solutions.

### Common Errors

1. **Invalid PDF URL**

   - **Error**: "Failed to load PDF file" or "Invalid PDF format".
   - **Cause**: The `src` prop points to an invalid or inaccessible URL.
   - **Solution**: Verify the URL is correct and accessible. Use a local file in `public/` or a hosted HTTPS URL.
   - **Example**:
     ```jsx
     <ReactIPdfViewer src="/sample.pdf" />
     ```

2. **CORS Restrictions**

   - **Error**: "Cross-Origin Request Blocked" when loading an external PDF.
   - **Cause**: The PDF’s server doesn’t allow cross-origin requests.
   - **Solution**: Host the PDF on the same domain or use a CORS proxy. Alternatively, serve from `public/`.
   - **Example**:
     ```jsx
     const App = () => {
       const pdfUrl =
         process.env.NODE_ENV === "development"
           ? "/sample.pdf"
           : "https://your-domain.com/sample.pdf";
       return <ReactIPdfViewerLite src={pdfUrl} />;
     };
     ```

3. **Content Security Policy (CSP) Error**

   - **Error**: "Refused to connect to 'blob:...' because it violates the Content Security Policy".
   - **Cause**: Blob URLs used by `pdf.js` are blocked by your app’s CSP.
   - **Solution**: Update your CSP to allow blob URLs in the `connect-src` directive.
     ```html
     <meta
       http-equiv="Content-Security-Policy"
       content="connect-src 'self' blob:;"
     />
     ```

4. **Mobile Rendering Issues**

   - **Error**: PDF fails to render on mobile devices, or blob URLs are blocked.
   - **Cause**: Browser security restricts blob URLs or iframe rendering on mobile.
   - **Solution**: Use direct HTTPS URLs and rely on `pdf.js` canvas rendering. Test with a local PDF.
   - **Example**:
     ```jsx
     <ReactIPdfViewerLite src="/sample.pdf" autoHeight />
     ```

5. **File Loading Failure**

   - **Error**: "PDF.js: Failed to fetch" or "Corrupted PDF".
   - **Cause**: The PDF file is corrupted or unsupported by `pdf.js`.
   - **Solution**: Validate the PDF with Adobe Acrobat. Use a try-catch block for error handling.
   - **Example**:

     ```jsx
     import React, { useState } from "react";
     import {ReactIPdfViewerLite} from "react-ipdf-viewer-lite";

     const App = () => {
       const [error, setError] = useState(null);
       const handleError = (err) => setError(err.message);

       return (
         <div>
           {error ? <p>Error: {error}</p> : null}
           <ReactIPdfViewerLite
             src="sample.pdf"
           />
         </div>
       );
     };
     ```

### Error Handling Tips

- **Validate Props**: Ensure `src` is a valid string. Use a fallback URL if needed.
  ```jsx
  const pdfUrl = src || "/fallback.pdf";
  <ReactIPdfViewer src={pdfUrl} />;
  ```
- **Handle Load Events**: Use `onError` (if supported) or wrap in try-catch.
- **Test on Mobile**: Verify rendering on iOS/Android.
- **Monitor Console**: Check for `pdf.js` warnings (e.g., missing CMaps).
- **Use HTTPS**: Serve PDFs over HTTPS to avoid mixed content errors.

## Additional Features

Beyond the core props, `ReactIPdfViewerLite` offers:

- **Zoom Controls**: Adjust zoom via toolbar buttons.
- **TypeScript Compatibility**: Works in TypeScript projects.

### Limitations

- Supports PDFs only.
- No built-in annotations or text selection.
- Large PDFs may impact performance on low-end devices.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add YourFeature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a Pull Request.

Please ensure your code follows the existing style and includes tests where applicable.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For issues, questions, or feature requests, please open an issue on the [GitHub repository](https://github.com/Sudeepa-R/react-ipdf-viewer-lite) or contact [Sudeepa R](https://github.com/Sudeepa-R).# react-ipdf-viewer
