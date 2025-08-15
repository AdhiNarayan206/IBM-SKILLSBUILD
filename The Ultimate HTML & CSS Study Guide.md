The Ultimate HTML & CSS Study Guide 🚀
Welcome! This guide is designed to give you a solid foundation in HTML and CSS, the two core technologies for building web pages. Think of it like building a house: HTML is the structure (the walls, rooms, and roof), and CSS is the decoration (the paint, furniture, and landscaping).

Part 1: HTML - The Structure of the Web
HTML (HyperText Markup Language) is the standard language used to create and structure the content of a web page. It uses tags to define elements like headings, paragraphs, images, and links.
The Basic HTML Document
Every HTML file has a fundamental structure. This is often called the "boilerplate."
html<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Web Page</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is my very first paragraph.</p>
</body>
</html>
Key Components:

<!DOCTYPE html>: Declares the document type. It tells the browser to interpret the code as HTML5.
<html>: The root element that wraps everything. The lang attribute is important for accessibility.
<head>: Contains meta-information about the page (like the title, character set, and links to stylesheets). Content here is not visible on the page.
<body>: Contains all the content that is visible to the user.

Core HTML Elements
Text Formatting
These are the most common tags for handling text on a page.

<h1> to <h6>: Headings, from most important (h1) to least important (h6).
<p>: A paragraph.
<strong>: For text with strong importance (usually displays as bold).
<em>: For emphasized text (usually displays as italic).
<span>: A generic inline container used to group text for styling, without adding a line break.
<br>: A line break.

Lists
html<h3>My Favorite Drinks</h3>
<ul>
  <li>Coffee</li>
  <li>Tea</li>
  <li>Water</li>
</ul>

<h3>My To-Do List</h3>
<ol>
  <li>Wake up</li>
  <li>Code</li>
  <li>Sleep</li>
</ol>
Links & Images

<a>: The anchor tag, used for hyperlinks. The href attribute contains the URL.
<img>: The image tag. It's self-closing.

src: The path to the image file.
alt: Alternative text. Crucial for accessibility and shown if the image fails to load.



html<a href="https://www.google.com">Go to Google</a>
<br><br>
<img src="https://example.com/cat.jpg" alt="A cute orange cat" width="300">
Semantic HTML5: Writing Meaningful Code
Semantic HTML means using tags that describe the meaning of the content they contain. This improves SEO (Search Engine Optimization), accessibility for screen readers, and makes your code much easier to read.

<header>: The top section of a page or section, usually containing the logo and navigation.
<nav>: Contains the main navigation links.
<main>: The primary, unique content of the page. There should only be one <main> element.
<section>: A thematic grouping of content (e.g., "About Us," "Our Services").
<article>: A self-contained piece of content that could stand on its own (e.g., a blog post, a news story).
<aside>: For secondary content, like a sidebar.
<footer>: The bottom section of a page or section, usually containing copyright info and contact links.

Tables & Forms
Tables
Used to display tabular data.
html<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Role</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Alwin</td>
      <td>Developer</td>
    </tr>
    <tr>
      <td>Saji</td>
      <td>Designer</td>
    </tr>
  </tbody>
</table>
Forms
Used to collect user input.
html<form>
  <label for="username">Username:</label><br>
  <input type="text" id="username" name="username"><br><br>

  <label for="password">Password:</label><br>
  <input type="password" id="password" name="password"><br><br>
  
  <button type="submit">Log In</button>
</form>

Part 2: CSS - Styling the Web
CSS (Cascading Style Sheets) is the language we use to style an HTML document. It controls the colors, fonts, spacing, layout, and overall visual presentation of the webpage.
How to Add CSS
There are three ways to include CSS, but External is the best practice for most projects.

Inline: The style attribute is added directly to an HTML tag. (Use sparingly!)
html<p style="color: blue;">This is a blue paragraph.</p>

Internal: CSS rules are placed inside a <style> tag within the HTML <head>.
External: CSS rules are written in a separate .css file and linked from the HTML <head>.
html<link rel="stylesheet" href="styles.css">


CSS Selectors: Targeting Elements
Selectors are patterns that select the HTML elements you want to style.

Element Selector: Selects all elements of a certain type.
cssp { color: #333; }

Class Selector: Selects all elements with a specific class attribute.
css.main-content { font-size: 16px; }

ID Selector: Selects the one element with a specific ID.
css#page-header { background-color: #f2f2f2; }

Descendant Selector: Selects elements that are inside another element.
cssarticle p { line-height: 1.6; }

Pseudo-classes: Selects elements based on their state or position (e.g., :hover, :focus).
Pseudo-elements: Style a specific part of an element (e.g., ::before, ::after).

The Box Model: The Foundation of Layout
Every element on a page is a rectangular box. The CSS box model describes how this box is structured.

Content: The text, image, or other media in the element.
Padding: The transparent space between the content and the border.
Border: A line that goes around the padding and content.
Margin: The transparent space around the outside of the border, separating it from other elements.

Pro Tip: Always use box-sizing: border-box;. It makes layout math much simpler by including the padding and border within the element's defined width and height.
css* {
  box-sizing: border-box;
}
Layout: Positioning Elements
The display Property
This property controls how an element behaves in the document flow.

block: Takes up the full width available and starts on a new line.
inline: Takes up only as much width as necessary and doesn't start on a new line.
inline-block: Like inline, but you can set width and height.
none: The element is completely removed from the document flow.

The position Property
This allows you to take elements out of the normal document flow and place them exactly where you want them.

static: The default value. The element stays in the normal document flow.
relative: The element can be moved relative to its normal position using top, right, bottom, and left. It also creates a positioning context for child elements.
absolute: The element is positioned relative to its nearest positioned ancestor.
fixed: The element is positioned relative to the viewport (the browser window). It stays in the same place even when the page is scrolled.

Flexbox (display: flex)
A modern, one-dimensional layout system that makes it easy to align items in a row or column.
HTML:
html<div class="flex-container">
  <div class="box">1</div>
  <div class="box">2</div>
  <div class="box">3</div>
</div>
CSS:
css.flex-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #f0f0f0;
  height: 200px;
}

.box {
  width: 80px;
  height: 80px;
  background-color: #007bff;
  color: white;
  text-align: center;
  line-height: 80px; /* Vertically centers text */
  font-size: 2rem;
}
Key Flexbox Properties:

justify-content: Controls horizontal alignment
align-items: Controls vertical alignment
flex-direction: Sets the direction of flex items (row, column, etc.)
flex-wrap: Controls whether items wrap to new lines

Grid (display: grid)
An even more powerful two-dimensional layout system for creating complex row and column-based layouts.
css.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1rem;
}
Responsive Design & Media Queries
Responsive design ensures your website looks great on all devices, from desktops to mobile phones. This is primarily achieved with Media Queries.
A media query applies a block of CSS rules only if a certain condition is true (usually the width of the viewport).
css/* Default styles for all screens */
.container {
  width: 90%;
  margin: 0 auto;
  display: flex;
  gap: 1rem;
}

/* Styles for screens 768px wide or smaller */
@media (max-width: 768px) {
  .container {
    flex-direction: column; /* Stack items vertically on smaller screens */
  }
}
Important: Always include the viewport meta tag in your HTML <head> to ensure proper scaling on mobile devices:
html<meta name="viewport" content="width=device-width, initial-scale=1.0">
Common CSS Properties Reference
Typography
cssfont-family: Arial, sans-serif;
font-size: 16px;
font-weight: bold;
line-height: 1.6;
text-align: center;
text-decoration: underline;
color: #333;
Spacing & Sizing
csswidth: 100px;
height: 50px;
margin: 10px;
padding: 15px;
border: 2px solid #ccc;
border-radius: 5px;
Colors & Backgrounds
cssbackground-color: #f0f0f0;
background-image: url('image.jpg');
background-size: cover;
background-position: center;
opacity: 0.8;

Best Practices & Tips
HTML Best Practices

Use semantic HTML elements whenever possible
Always include the alt attribute for images
Use proper heading hierarchy (h1 → h2 → h3, etc.)
Validate your HTML using online validators
Keep your code clean and well-indented

CSS Best Practices

Use external stylesheets instead of inline styles
Follow a consistent naming convention (BEM methodology is popular)
Organize your CSS with comments and logical sections
Use CSS custom properties (variables) for repeated values
Minimize the use of !important
Test your designs on multiple devices and browsers

Performance Tips

Optimize images for web use
Minimize HTTP requests
Use efficient CSS selectors
Avoid excessive nesting in CSS
Consider using CSS frameworks like Bootstrap or Tailwind for rapid development


Next Steps
Once you're comfortable with HTML and CSS, consider exploring:

JavaScript: Add interactivity to your web pages
CSS Preprocessors: Sass or Less for more powerful CSS
CSS Frameworks: Bootstrap, Tailwind CSS, or Bulma
Version Control: Learn Git and GitHub
Build Tools: Webpack, Vite, or Parcel
Modern CSS: CSS Grid, Custom Properties, and new layout techniques

Happy coding! ✨