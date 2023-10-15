# Frontend Documentation
## Tailwind CSS

https://tailwindcss.com/docs/installation

Tailwind CSS works by giving users a set of classes they can use to add styles. For example,  
`<p className="text-black">This text is black</p>`
is equivalent to making this CSS class in your stylesheet:  
`.text-black {
    color: rgb(0 0 0); 
}`

These predefined classes make it easier to write CSS and make styles more consistent. After adding a new Tailwind class to your components, run this command to add the corresponding CSS class to your stylesheet.  
`npx tailwindcss -i ./src/index.css -o ./public/output.css`

For convenience, run the frontend server from step in one terminal, then open another terminal and run this command:  
`npx tailwindcss -i ./src/index.css -o ./public/output.css --watch`

This will automatically rebuild the CSS as you edit your classes so you don't need to run the command every time.

The site has a list of available classes with their corresponding CSS. The quick search is very useful in finding relevant classes.

## Tailwind UI

Tailwind UI components are just normal React components that have Tailwind CSS classes added to them. To use Tailwind UI, sign in to https://tailwindui.com/ from VLAB, go to Components from the top nav bar, find the component you need, copy and paste the code they provide and edit the code to customise.

To find the Tailwind CSS documentation in this website: https://tailwindcss.com/docs/installation
