import React, { useState, useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { Button, Divider, Spin, Tooltip } from "antd";
import {
  DownloadOutlined,
  MoonOutlined,
  SunOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PDFRendererProps {
  fileUrl: string;
  themes: boolean;
}

const PDFRenderer: React.FC<PDFRendererProps> = ({ fileUrl, themes }) => {
  const [pdf, setPdf] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [theme, SetTheme] = useState(true);
  const canvasRefs = useRef<React.MutableRefObject<HTMLCanvasElement | null>[]>(
    []
  );

  useEffect(() => {
    SetTheme(themes);
  }, [themes]);

  useEffect(() => {
    pdfjsLib
      .getDocument(fileUrl)
      .promise.then((loadedPdf: pdfjsLib.PDFDocumentProxy) => {
        setPdf(loadedPdf);
        renderAllPages(loadedPdf);
      })
      .catch((error: Error) => {
        console.error("Error loading PDF:", error);
      });
  }, [fileUrl]);

  const renderAllPages = async (loadedPdf: pdfjsLib.PDFDocumentProxy) => {
    const numPages = loadedPdf.numPages;
    canvasRefs.current = Array(numPages)
      .fill(null)
      .map(() => React.createRef<HTMLCanvasElement>());

    for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
      const page = await loadedPdf.getPage(pageNumber);
      const canvas = canvasRefs.current[pageNumber - 1].current;
      if (!canvas) continue;

      const context = canvas.getContext("2d");
      if (!context) continue;

      const viewport = page.getViewport({ scale: 1.5 });
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;
    }
  };

  const handleZoomIn = () => {
    const newZoom = zoomLevel * 1.1;
    console.log(11111, newZoom);
    const _zoomLevel = newZoom > 5 ? 5 : newZoom;
    setZoomLevel(_zoomLevel);
  };

  const handleZoomOut = () => {
    const newZoom = zoomLevel / 1.1;
    const _zoomLevel = newZoom < 0.4 ? 0.4 : newZoom;
    setZoomLevel(_zoomLevel);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error("Failed to fetch PDF");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileUrl.split("/").pop() || "document.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <>
      <div
        style={{
          border: theme ? "2px solid black" : "2px solid #ECECEC",
          margin: "4px",
          marginBottom: "50px",
          height: "95vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Fixed Top Bar */}
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 10,
            justifyContent: "space-between",
            background: theme ? "#3C3C3C" : "#ECECEC",
            height: "45px",
            paddingRight: "10px",
            position: "sticky",
            top: 0,
            zIndex: 10,
            padding: "0 5px",
          }}
        >
          <div style={{ margin: "0px 10px" }}>
            <Tooltip title={theme ? "Light mode" : "Dark mode"}>
              {theme ? (
                <SunOutlined
                  style={{ color: theme ? "#fff" : "black", margin: "0px 5px" }}
                  onClick={() => {
                    SetTheme(!theme);
                  }}
                />
              ) : (
                <MoonOutlined
                  style={{ color: theme ? "#fff" : "black", margin: "0px 5px" }}
                  onClick={() => {
                    SetTheme(!theme);
                  }}
                />
              )}
            </Tooltip>
          </div>
          <div style={{ margin: "0px 10px" }}>
            <Tooltip title="Zoom In">
              <Button
                color="default"
                variant="filled"
                style={{ color: theme ? "#fff" : "black", margin: "0px 5px" }}
                onClick={handleZoomOut}
              >
                <ZoomOutOutlined />
              </Button>
            </Tooltip>
            <Tooltip title="Zoom Out">
              <Button
                color="default"
                variant="filled"
                style={{ color: theme ? "#fff" : "black", margin: "0px 5px" }}
                onClick={handleZoomIn}
              >
                <ZoomInOutlined />
              </Button>
            </Tooltip>
            <Divider
              style={{
                borderColor: theme ? "#fff" : "black",
                margin: "0px 5px",
              }}
              type="vertical"
            />
            <Tooltip title="Download">
              <Button
                color="default"
                variant="filled"
                style={{ color: theme ? "#fff" : "black", margin: "0px 5px" }}
                onClick={handleDownload}
              >
                <DownloadOutlined />
              </Button>
            </Tooltip>
          </div>
        </div>

        {/* Scrollable PDF Content */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            background: theme ? "#282828" : "#ffffff",
            height: "100vh",
            display: "flex",
            alignItems: zoomLevel > 1.9 ? "" : "center",
            justifyContent: zoomLevel > 1.9 ? "" : "center",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <div
            style={{
              transform: `scale(${zoomLevel})`,
              // transformOrigin: "left top",
              transformOrigin: zoomLevel > 1.9 ? "left top" : "center top",
              width: "50%",
              padding: "5px",

              minHeight: "3px",
            }}
          >
            {pdf &&
              Array.from({ length: pdf.numPages }, (_, index) => (
                <canvas
                  key={index}
                  ref={canvasRefs.current[index]}
                  style={{
                    width: "100%",
                    marginBottom: "3px",
                    border: "1px solid #ccc",
                  }}
                />
              ))}
          </div>
        </div>
      </div>
      {!pdf && (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <Spin size="large" tip="Loading PDF..." />
        </div>
      )}
    </>
  );
};

export default PDFRenderer;
