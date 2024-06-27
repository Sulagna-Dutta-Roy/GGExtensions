-- Talking Tom GG Script
-- This script is for educational purposes only

-- Function to search and modify coins
function modifyCoins()
  gg.setRanges(gg.REGION_ANONYMOUS)
  gg.searchNumber("100", gg.TYPE_DWORD) -- Search for the current amount of coins (change this number to match your current coins)
  gg.getResults(100)
  gg.editAll("999999", gg.TYPE_DWORD) -- Set the coins to 999999
  gg.toast("Coins modified successfully!")
end

-- Function to search and modify diamonds
function modifyDiamonds()
  gg.setRanges(gg.REGION_ANONYMOUS)
  gg.searchNumber("50", gg.TYPE_DWORD) -- Search for the current amount of diamonds (change this number to match your current diamonds)
  gg.getResults(100)
  gg.editAll("9999", gg.TYPE_DWORD) -- Set the diamonds to 9999
  gg.toast("Diamonds modified successfully!")
end

-- Function to unlock all items
function unlockAllItems()
  gg.setRanges(gg.REGION_ANONYMOUS)
  gg.searchNumber("0", gg.TYPE_DWORD) -- This is a simplified example; the actual search criteria will vary
  gg.getResults(100)
  gg.editAll("1", gg.TYPE_DWORD) -- Unlock all items (this is just an example and may not work for all items)
  gg.toast("All items unlocked!")
end

-- Main menu
function mainMenu()
  local menu = gg.choice({
    "Modify Coins",
    "Modify Diamonds",
    "Unlock All Items",
    "Exit"
  }, nil, "Talking Tom GG Script")
  
  if menu == 1 then
    modifyCoins()
  elseif menu == 2 then
    modifyDiamonds()
  elseif menu == 3 then
    unlockAllItems()
  elseif menu == 4 then
    gg.toast("Exiting script...")
    os.exit()
  end
end

-- Run the main menu function
mainMenu()
