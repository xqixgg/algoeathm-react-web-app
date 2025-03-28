# AlgoEAThm

## Starting the Application

### Backend Server
```bash
cd backend
node server.js
```
_Expected output: "Server running on port 3000"_

### Frontend
```bash
cd ..  # Return to root directory
npm run dev
```
_Visit: [http://localhost:5173](http://localhost:5173)_

## How to Use AlgoEAThm

### Home Page
The home page contains a form with four input fields:

1. **Ingredients (Required)**  
   - Enter ingredients you have, separated by commas  
   - Example: `chicken, rice, tomatoes`  
   - Max: 10 ingredients  
   - Be specific (e.g., `chicken breast` instead of `chicken`)

2. **Allergies (Optional)**  
   - List allergens to exclude (e.g., `peanuts, shellfish`)

3. **Cuisine Type (Optional)**  
   - Specify a preferred cuisine (e.g., `Italian`, `Mexican`)

4. **Time Limit (Optional)**  
   - Enter max cooking time in minutes (e.g., `30`)

### Generating a Recipe
1. Fill in at least the **Ingredients** field
2. Click **Generate**
3. Wait 5-10 seconds while the AI creates a recipe
4. You'll be redirected to the **Instructions** page

### Instructions Page
- Recipe name and description at the top
- Ingredients list on the left
- Step-by-step cooking instructions on the right
- Your preferences (allergies, cuisine, time) displayed

### Recipe Format
Generated recipes include:
- A descriptive title
- Ingredients with approximate quantities
- Numbered cooking steps
- Estimated cooking time
- Serving suggestions (if applicable)

## Troubleshooting

### "No API Key Found" Error
- Ensure `backend/.env` contains a valid Google AI API key
- Verify API access to the Gemini model

### Connection Errors
- Ensure both frontend and backend servers are running
- Check if ports `3000` and `5173` are available
- Verify internet connectivity

### Recipe Generation Issues
- Ensure ingredients are comma-separated
- Max ingredients: 10
- Refresh and try again if needed

### No Recipe Displayed
- Enter at least one ingredient
- Check browser console for errors
- Review backend server logs

## Technical Stack
- **Frontend:** React + TypeScript + Vite
- **Backend:** Express.js + Node.js
- **Database:** Firebase
- **AI:** Google Gemini AI API
- **State Management:** React Context
- **Styling:** Custom CSS

## Future Features
- Save favorite recipes
- User accounts
- Share recipes
- Custom recipe collections
- Dietary preference profiles

## Support
For help:
1. Check **Troubleshooting**
2. Review **Console Logs**
3. Submit an issue on **GitHub**

