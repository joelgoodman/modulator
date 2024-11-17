declare module '*.css' {
  const styles: {
    [className: string]: string;
  };
  export default styles;
}

declare module '*.module.css' {
  const styles: {
    [className: string]: string;
  };
  export default styles;
}

// Support for CSS Modules with specific naming patterns
declare module '*.block.css' {
  const styles: {
    [className: string]: string;
  };
  export default styles;
}

declare module '*.component.css' {
  const styles: {
    [className: string]: string;
  };
  export default styles;
}
