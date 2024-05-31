import React, { useCallback, useRef } from "react";
import IFrame from "react-frame-component";
import Cropper from "react-cropper";
import initialContent from "./initialIframeContent";
export default (props) => {
  const instanceRef = useRef();
  const cropperRef = useRef();
  const handleRef = useCallback((ref) => {
    instanceRef.current = {
      contentDocument: ref ? ref.node.contentDocument : null,
      contentWindow: ref ? ref.node.contentWindow : null,
    };
  }, []);
  const onContentDidMount = () => {};
  const ready = () => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    const plusButton = cropper.container.children[1].children[2].children[3];
    plusButton.addEventListener("click", () => {
      const imgData = cropper.getCroppedCanvas().toDataURL();
      props.onCropEnd(imgData);
    });
  };
  return (
    <IFrame
      initialContent={initialContent()}
      style={{
        zIndex: 2147483647,
        top: "0px",
        left: "0px",
        height: "100%",
        width: "100%",
        border: "none",
      }}
      ref={handleRef}
      contentDidMount={onContentDidMount}
    >
      <Cropper
        src={props.imgSrc}
        minCropBoxWidth={100}
        minCropBoxHeight={100}
        zoomOnWheel={false}
        style={{
          height: "100%",
          width: "100%",
          border: "none",
        }}
        ready={ready}
        initialAspectRatio={16 / 9}
        guides={false}
        ref={cropperRef}
      />
    </IFrame>
  );
};
