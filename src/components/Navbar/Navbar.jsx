import { 
  Box,
  Flex, 
  Heading, 
  Button,
  Text,
  HStack,
  VStack,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  useColorMode,
  IconButton,
  Badge,
  Spacer
} from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { colorMode, toggleColorMode } = useColorMode();
  const userEmail = "currentuser@example.com"; // Mock current user
  
  const handleSignOut = () => {
    // Simple redirect to login for now
    navigate("/login");
  };
  
  // Color scheme
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const brandColor = useColorModeValue("blue.500", "blue.300");

  // Navigation functions
  const goToDashboard = () => navigate("/");
  const handleCreatePost = () => navigate("/create-post");
  const goToProfile = () => navigate("/profile");

  // Check if current route is active
  const isActive = (path) => location.pathname === path;

  // Navigation items
  const navItems = [
    { label: "Dashboard", path: "/", icon: "🏠", action: goToDashboard },
    { label: "Create Post", path: "/create-post", icon: "✏️", action: handleCreatePost },
    { label: "My Profile", path: "/profile", icon: "👤", action: goToProfile },
  ];

  return (
    <Box

      as="nav"
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      boxShadow="lg"
      position="sticky"
      top="0"
      zIndex="1000"
    >
      <Box maxW="1200px" mx="auto" w="100%">
        <Flex
          align="center"
          justify="space-between"
          wrap="wrap"
          py={4}
          px={{ base: 4, md: 8 }}
        >
          {/* Logo/Brand */}
          <Heading 
            as="h1" 
            size="lg" 
            letterSpacing="tight"
            color={brandColor}
            fontWeight="bold"
            cursor="pointer"
            onClick={goToDashboard}
            _hover={{ 
              color: "blue.600", 
              transform: "scale(1.05)" 
            }}
            transition="all 0.2s"
          >
            📱 SocialApp
          </Heading>

          <Spacer />

          {/* Desktop Navigation */}
          <HStack 
            spacing={2} 
            display={{ base: "none", md: "flex" }}
            mr={4}
          >
            {navItems.map((item) => (
              <Button
                key={item.path}
                onClick={item.action}
                variant={isActive(item.path) ? "solid" : "ghost"}
                colorScheme={isActive(item.path) ? "blue" : "gray"}
                size="md"
                _hover={{
                  bg: isActive(item.path) ? "blue.600" : useColorModeValue("gray.100", "gray.700"),
                  transform: "translateY(-1px)",
                }}
                transition="all 0.2s"
                fontWeight={isActive(item.path) ? "bold" : "medium"}
              >
                {item.icon} {item.label}
              </Button>
            ))}
          </HStack>

          {/* Dark Mode Toggle */}
          <IconButton
            aria-label="Toggle color mode"
            icon={<Text fontSize="xl">{colorMode === "light" ? "🌙" : "☀️"}</Text>}
            onClick={toggleColorMode}
            variant="ghost"
            size="md"
            _hover={{
              bg: useColorModeValue("gray.100", "gray.700"),
              transform: "scale(1.1)",
            }}
            transition="all 0.2s"
            mr={2}
          />

          {/* User Menu */}
          <Menu>
            <MenuButton
              as={Button}
              variant="ghost"
              cursor="pointer"
              _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
              _active={{ bg: useColorModeValue("gray.200", "gray.600") }}
              transition="all 0.2s"
            >
              <HStack spacing={3}>
                <Avatar
                  size="sm"
                  name={userEmail}
                  bg="blue.500"
                  color="white"
                />
                <VStack spacing={0} align="start" display={{ base: "none", md: "flex" }}>
                  <Text fontSize="sm" fontWeight="medium" color={textColor}>
                    {userEmail.length > 20 ? userEmail.substring(0, 20) + "..." : userEmail}
                  </Text>
                  <Badge colorScheme="green" size="sm">
                    Online
                  </Badge>
                </VStack>
              </HStack>
            </MenuButton>
            
            <MenuList
              bg={bgColor}
              borderColor={borderColor}
              boxShadow="lg"
              minW="200px"
            >
              {/* Mobile Navigation Items */}
              <VStack display={{ base: "flex", md: "none" }} spacing={0} align="stretch">
                {navItems.map((item) => (
                  <MenuItem
                    key={item.path}
                    onClick={item.action}
                    bg={isActive(item.path) ? useColorModeValue("blue.50", "blue.900") : "transparent"}
                    color={isActive(item.path) ? useColorModeValue("blue.600", "blue.300") : textColor}
                    fontWeight={isActive(item.path) ? "bold" : "normal"}
                    _hover={{ bg: useColorModeValue("gray.50", "gray.700") }}
                  >
                    {item.icon} {item.label}
                  </MenuItem>
                ))}
                <MenuDivider />
              </VStack>
              
              {/* User Info */}
              <MenuItem isDisabled>
                <VStack spacing={1} align="start">
                  <Text fontSize="sm" fontWeight="bold">
                    {userEmail}
                  </Text>
                  <Badge colorScheme="green" size="xs">
                    Active User
                  </Badge>
                </VStack>
              </MenuItem>
              
              <MenuDivider />
              
              {/* Settings & Logout */}
              <MenuItem 
                onClick={toggleColorMode}
                color={textColor}
                _hover={{ bg: useColorModeValue("gray.50", "gray.700") }}
              >
                {colorMode === "light" ? "🌙" : "☀️"} {colorMode === "light" ? "Dark Mode" : "Light Mode"}
              </MenuItem>
              
              <MenuItem 
                color={textColor}
                _hover={{ bg: useColorModeValue("gray.50", "gray.700") }}
              >
                ⚙️ Settings
              </MenuItem>
              
              <MenuItem 
                color={textColor}
                _hover={{ bg: useColorModeValue("gray.50", "gray.700") }}
              >
                ❓ Help & Support
              </MenuItem>
              
              <MenuDivider />
              
              <MenuItem 
                onClick={handleSignOut}
                color="red.500"
                _hover={{ bg: useColorModeValue("red.50", "red.900"), color: "red.600" }}
                fontWeight="medium"
              >
                🚪 Sign Out
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Box>
    </Box>
  );
};

export default Navbar;
