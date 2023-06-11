// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "/Users/shwetaparanjape/Blockchain_stuff/interview assignments/contracts/node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "/Users/shwetaparanjape/Blockchain_stuff/interview assignments/contracts/node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";

contract StakingToken is ERC20 {
    using SafeMath for uint256;
    
    uint256 public constant STAKING_DURATION = 1 days; // Staking duration for rewards
    
    struct Stake {
        uint256 amount;
        uint256 startTime;
    }
    
    mapping(address => Stake) public stakes;
    mapping(address => uint256) public rewards;
    
    uint256 public totalStaked;
    address public owner;
    
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);
    
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        owner = msg.sender;
    }
    
    function mint(address account, uint256 amount) external {
        require(msg.sender == owner, "You are not owner");
        require(amount > 0, "Amount must be greater than zero.");
        _mint(account, amount);
        mintTokensForReward();
    }

    function mintTokensForReward() internal {
        require(msg.sender == owner, "You are not owner");
        _mint(address(this), 100);
    }
    
    function stake(uint256 amount) external {
        require(amount > 0, "Amount must be greater than zero.");
        require(stakes[msg.sender].amount == 0, "You can only stake once at a time.");
        
        super.approve(msg.sender, amount);
        super.transferFrom(msg.sender, address(this), amount);
        
        stakes[msg.sender] = Stake(amount, block.timestamp);
        totalStaked = totalStaked.add(amount);
        
        emit Staked(msg.sender, amount);
    }
    
    function unstake() external {
        Stake storage userStake = stakes[msg.sender];
        require(userStake.amount > 0, "No staked amount found.");
        
        uint256 stakingDuration = block.timestamp.sub(userStake.startTime);
        
        uint256 reward = calculateReward(userStake.amount, stakingDuration);
        rewards[msg.sender] = rewards[msg.sender].add(reward);
        
        uint256 totalTransferAmount = userStake.amount.add(reward);

        ERC20(address(this)).transfer(msg.sender, totalTransferAmount);
        totalStaked = totalStaked.sub(userStake.amount);
        
        delete stakes[msg.sender];
        delete rewards[msg.sender];
        
        emit Unstaked(msg.sender, userStake.amount);
        emit RewardsClaimed(msg.sender, reward);
    }
    
    function calculateReward(uint256 amount, uint256 duration) internal pure returns (uint256) {
        uint256 rewardPercentage = 0;
        
        if (duration >= STAKING_DURATION) {
            rewardPercentage = 10; // 10% reward for staking duration >= 1 day
        } else {
            rewardPercentage = duration.mul(10).div(STAKING_DURATION);
        }
        
        return amount.mul(rewardPercentage).div(100);
    }
}
