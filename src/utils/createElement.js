export default function createElement({ type, id, classList, dataSet }) {
  if (!htmlElements.includes(type)) {
    console.log(type + " is not a recognised HTML element!");
    return false;
  }
  const el = document.createElement(type);

  if (id) el.id = id.toString();

  if (classList && classList.length) {
    classList.forEach((className) => el.classList.add(className));
  }
  if (dataSet && dataSet.length) {
    dataSet.forEach((property) => (el.dataSet[property.name] = property.value));
  }

  return el;
}

const htmlElements = ["div", "span", "p", "h1", "h2", "h3", "h4", "h5", "h6"];
