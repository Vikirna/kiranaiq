const VideoBackground = () => {
    return (
      <div className="fixed inset-0 -z-10 w-full h-full">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/kirana.mp4" type="video/mp4" />
        </video>
        {/* Overlay so content stays readable */}
        <div className="absolute inset-0 bg-kirana-light/0" />
      </div>
    )
  }
  
  export default VideoBackground