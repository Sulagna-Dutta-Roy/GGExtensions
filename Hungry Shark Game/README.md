# Hungry Shark! 🦈

A simple 2D game imagined, project-managed and tested by my 5 year-old daughter! Coded (by me) in TypeScript and React.

You can play it here: https://hungry-shark.now.sh

## Why?

Like most of the world, we're quarantined due to COVID19. I'm working from home and my daughter started taking an avid interest in my software engineering day-job. She found the colourful code editor and flashing unit tests all very intriguing. In trying to answer all her questions about what it is I'm doing, I realised it would be easier to explain by getting her involved.

Let's make a game together!

## Teamwork Makes The Dream Work

My daughter agrees: we made a good team. She acted as a product owner, game designer and quality assurance engineer. I was the programmer. I'd sit and code on my laptop whilst she held my iPhone (connected to my localhost) and tested every change as I made it.

We talked about every step and what we would do next. It was interesting see her understanding grow. She also had to learn some patience - "why can't we just make the whole game right away?!". Because first we need to draw some water... then a shark... then we can make the shark move... then we need some fish... One step at a time, dear.

## Where did Hungry Shark come from?

The starting point for this game was a list of Apple emoji characters. I don't know anything about creating game graphics, but I thought the emoji universe is quite a rich, readily available source of artwork.

Initially, my daughter was drawn to the caterpillar. The game was to be Hungry Caterpillar, but when she spotted the shark we pivoted sharply.

## What next for Hungry Shark?

There are a few issues and feature requests we are aware of...

- Can the shark move more smoothly?
- Tapping the buttons is a bit janky on mobile phones (physical keyboard control works much better)
- Could the different creatures be worth different points?
- Can there be something that the shark needs to avoid?

We might come back and make some of these improvements, but it's more likely we will just move on to our next game!

## What will you do for your next project?

We're both really happy with how Hungry Shark turned out. Next time we're going to try:

- a different idea for a 2D game
- planning our project with a kanban board and post-it notes
- writing automated tests together

## Wait, why did you add Google Analytics?

My daughter was very interested in the fact that her friends and family - and even people she doesn't know - might play her game. "But how will we know if they played it?" It was a good opportunity to teach the concept that, with software, you can actually measure and observe what your users are doing.

## Wait, why is this a server-rendered React app?

Just ignore that. This game started life in a [Codesandbox](https://codesandbox.io/s/hungry-shark-6h28v). When we wanted to share it with friends and family, I just plonked it in a [NextJS](https://nextjs.org/) boilerplate because that's what I've been hacking with lately. We didn't care about the technology choice - we just wanted to create a simple game as quickly as possible.

It also meant that deploying this with [Zeit's now.sh](https://zeit.co/home) was a a one-line command.

Next time we might try something more suitable for games (HTML5 canvas or some game framework.) Or we might just use what we know.

## What other (technical) things did you learn?

### Emoji 'text' vs images

Emoji characters render quickly but they vary from device to device and it's harder to be confident about their exact dimensions. I moved from rendering emojis to taking `.png` files of the emojis and rendering images.

### Importance of the React `key` prop

Switching from emoji text to images caused everything to slow down and the images would visibly flash on every game tick. This was because the images were being re-rendered every time. By creating a unique ID for each creature and using this as the `key` prop, I prevented the characters from re-rendering unnecessarily.

The next optimisation would have been to use an image sprite (instead of multiple images) but this didn't feel necessary for this game.

### CSS animations / React has its limitations...

The simplistic approach of a fixed grid of `div`s got us up-and-running very quickly with a playable game - which is very important when you're working with a 5 year old. However, it did limit the fluidity of the game. I'd like to try a different approach next time.

### Mashing game controls on iOS Safari is not what it's intended for

When furiously tapping the controls on a touch screen, the viewport can jump about, you can accidentally zoom in/out and it's just not very responsive. There are definitely better ways to control a mobile game.

These lines of CSS helped a bit and I would probably use them again:

```css
* {
  touch-action: manipulation !important;
  -webkit-touch-callout: none !important;
  user-select: none !important;
}
```

### TypeScript helped

When trying to move fast, TypeScript helped to avoid simple `undefined` type errors. I had types for all the `GameState` and `Action`s which meant I could have autocomplete and move quickly without having to check what values/strings I had used.

I might try a different game design approach or framework, but I will probably stick with TypeScript.

### I should have written tests for the game logic

For such a simple game, there wasn't much logic at all. But the complexity did ramp up. At the very end I was trying to add a feature (to give visual feedback when a creature is eaten) and kept causing regressions. In the end I abandoned that feature in favour of shipping (and keeping my daughter interested!)

I did enjoy writing the logic as a React `useReducer` hook. These are pure functions which would be easy to test. For the next project I am going to try test-driving the game logic.

## Thanks for reading

We hope you [enjoy Hungry Shark](https://hungry-shark.now.sh)!
