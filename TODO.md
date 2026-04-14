# Health Compass - Login Dropdown Implementation TODO

## Status: In Progress ✅

### Approved Plan Steps:

1. [x] **Create TODO.md** - Track progress (current)

2. [ ] **Create `src/components/AuthForm.tsx`** 
   - Extract form logic/state/handlers from Auth.tsx
   - Reusable email/password/Google form with mode toggle
   - Supabase auth integration preserved

3. [ ] **Create `src/components/LoginDropdown.tsx`**
   - shadcn DropdownMenu wrapper
   - Embed AuthForm
   - Matching landing page styling (gradient blue, neumorphic)
   - Smooth "pocket unfold" animation from top
   - Responsive (sheet on mobile)

4. [ ] **Update `src/pages/Landing.tsx`**
   - Replace all 3 Login buttons (`<Link to="/login">`) with `<LoginDropdown />`
   - Add necessary imports (`LoginDropdown`, `useAuth`)
   - Handle logged-in state (show avatar/logout)

5. [ ] **Minor update `src/pages/Auth.tsx`** (if needed)
   - Use AuthForm internally as fallback full-page

6. [ ] **Add custom CSS to `src/index.css`**
   - `@keyframes unfold` for pocket effect

7. [ ] **Test & Complete**
   - `bun run dev`
   - Verify dropdown animation, form submit, mobile responsive
   - Use `attempt_completion`

**Next step:** Create AuthForm.tsx
