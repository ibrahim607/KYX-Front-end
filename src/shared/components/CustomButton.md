# CustomButton Component

## Location
`src/shared/components/CustomButton.js`

## Description
A flexible, reusable button component used throughout the application. This is the **canonical button implementation** - use this component for all button needs.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | **required** | Button text to display |
| `onPress` | `function` | **required** | Function called when button is pressed |
| `backgroundColor` | `string` | `colors.black` | Background color of the button |
| `textColor` | `string` | `colors.white` | Text color |
| `bordered` | `boolean` | `false` | Add a border around the button |
| `style` | `object` | `undefined` | Additional custom styles for the button container |
| `textStyle` | `object` | `undefined` | Additional custom styles for the button text |
| `disabled` | `boolean` | `false` | Disable button interaction |

## Usage Examples

### Basic Button
```javascript
import CustomButton from '../shared/components/CustomButton';

<CustomButton 
  title="Submit" 
  onPress={handleSubmit} 
/>
```

### White Button with Border (Skip Button)
```javascript
<CustomButton
  title="Skip"
  backgroundColor={colors.white}
  textColor={colors.black}
  bordered
  onPress={handleSkip}
/>
```

### Disabled Button
```javascript
<CustomButton
  title="Continue"
  onPress={handleContinue}
  disabled={!isFormValid}
/>
```

### Custom Styled Button
```javascript
<CustomButton
  title="Login"
  onPress={handleLogin}
  style={{ width: '100%', marginTop: 20 }}
  textStyle={{ fontSize: 18 }}
/>
```

## Design Tokens
- **Border Radius**: 32px (rounded)
- **Padding**: Vertical 12px, Horizontal 32px
- **Font Size**: 16px
- **Font Weight**: 600 (semi-bold)
- **Border Color** (when bordered): `colors.darkGrey`

## Notes
- Previously, there was a duplicate `CustomButton` implementation in `ButtonSection.js`. This has been consolidated into this single shared component.
- The button includes `activeOpacity={0.7}` for visual feedback on press.
- Disabled state automatically reduces opacity to 0.5.
