# Tailwind Class Grouper

A VSCode extension that groups Tailwind CSS classes into readable, categorized blocks using `clsx`.

## Installation

### From Marketplace

1. Open VSCode
2. Go to Extensions (`Ctrl+Shift+X` / `Cmd+Shift+X`)
3. Search for **Tailwind Class Grouper**
4. Click **Install**

### From VSIX

1. Download the `.vsix` file from [Releases](https://github.com/ella-yschoi/tailwind-class-grouper/releases)
2. In VSCode, open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
3. Run: **Extensions: Install from VSIX...**
4. Select the downloaded `.vsix` file

## Features

- **Automatic Grouping**: Organizes Tailwind classes by category (13 categories)
- **clsx Format**: Converts class strings into structured `clsx()` calls
- **Variant Support**: Handles `hover:`, `md:`, `dark:`, `focus:`, etc. - classes are categorized by their base utility
- **Arbitrary Values**: Supports `w-[100px]`, `bg-[#ff0000]`, etc.
- **Keyboard Shortcut**: `Ctrl+K G` (Windows/Linux) / `Cmd+K G` (Mac)

## Usage

1. Select a `className` or `class` attribute in your code:

   ```jsx
   className="flex w-full h-32 bg-blue-500 hover:bg-blue-700 text-white dark:text-gray-100 p-4 rounded-lg shadow-md cursor-pointer scale-105 ring-2 overflow-hidden z-10"
   ```

2. Run the command:
   - Keyboard shortcut: `Ctrl+K G` / `Cmd+K G`
   - Or open the Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`) and run: **Tailwind: Group Classes**

3. The selected code will be transformed into:

   ```jsx
   className={clsx(
     // Size
     "w-full h-32",

     // Layout
     "flex",

     // Spacing
     "p-4",

     // Border
     "rounded-lg",

     // Background
     "bg-blue-500 hover:bg-blue-700",

     // Text
     "text-white dark:text-gray-100",

     // Effects
     "shadow-md",

     // Interactivity
     "cursor-pointer",

     // Transform
     "scale-105",

     // Ring/Outline
     "ring-2",

     // Overflow/Display
     "overflow-hidden z-10"
   )}
   ```

## Class Categories

The extension groups classes into the following categories:

| Category | Patterns |
|---|---|
| **Size** | `w-*`, `h-*`, `min-w-*`, `max-w-*`, `min-h-*`, `max-h-*`, `size-*` |
| **Layout** | `flex`, `grid`, `block`, `inline`, `relative`, `absolute`, `fixed`, `sticky`, `top-*`, `items-*`, `justify-*`, etc. |
| **Spacing** | `p-*`, `m-*`, `gap-*`, `space-*`, `px-*`, `py-*`, etc. |
| **Border** | `border-*`, `rounded-*`, `divide-*` |
| **Background** | `bg-*`, `from-*`, `via-*`, `to-*`, `gradient-*` |
| **Text** | `text-*`, `font-*`, `leading-*`, `tracking-*`, `uppercase`, `truncate`, etc. |
| **Effects** | `shadow-*`, `transition-*`, `duration-*`, `ease-*`, `animate-*`, `delay-*` |
| **Interactivity** | `cursor-*`, `select-*`, `pointer-events-*`, `scroll-*`, `resize`, etc. |
| **Transform** | `scale-*`, `rotate-*`, `translate-*`, `skew-*`, `origin-*` |
| **Filter** | `blur-*`, `brightness-*`, `contrast-*`, `grayscale`, `backdrop-*`, `drop-shadow-*`, etc. |
| **Ring/Outline** | `ring-*`, `outline-*` |
| **Overflow/Display** | `overflow-*`, `z-*`, `visible`, `invisible`, `hidden`, `opacity-*` |
| **Others** | Any classes that don't match the above categories |

### Variant Handling

Tailwind variants like `hover:`, `md:`, `dark:`, `focus:` are stripped before classification, so the class is placed in the correct category based on its base utility:

- `hover:bg-blue-500` → **Background** category
- `md:flex` → **Layout** category
- `dark:text-white` → **Text** category

The original class string (with variants) is preserved in the output.

## Development

### Compile

```bash
npm run compile
```

### Watch Mode

```bash
npm run watch
```

### Run Tests

```bash
npm test
```

### Package

```bash
npm run package
```

## License

[MIT](LICENSE)
