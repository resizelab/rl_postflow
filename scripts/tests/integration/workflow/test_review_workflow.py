#!/usr/bin/env python3
"""
Test script for the Review Workflow system
Simulates the complete review process
"""

import sys
import json
from pathlib import Path

# Add src directory to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from src.integrations.review_workflow import ReviewWorkflowManager

def test_review_workflow():
    """Test the complete review workflow"""
    print("🔬 Testing Review Workflow System")
    print("=" * 50)
    
    # Load configuration
    config_path = Path(__file__).parent.parent / "config" / "integrations.json"
    if not config_path.exists():
        print("❌ Configuration not found")
        return
    
    with open(config_path, 'r') as f:
        config = json.load(f)
    
    # Initialize workflow manager
    try:
        print("🔧 Initializing Review Workflow Manager...")
        workflow = ReviewWorkflowManager(config)
        print("✅ Workflow manager initialized")
        
        # Test 1: Scan for new exports
        print("\n🔍 Testing: Scan for new exports")
        new_exports = workflow.scan_new_exports()
        print(f"   Found {len(new_exports)} new exports")
        
        if new_exports:
            for export in new_exports:
                print(f"   • {export.nomenclature} v{export.version} - {export.status.value}")
        
        # Test 2: Simulate export notifications
        print("\n📧 Testing: Export notifications")
        for export in new_exports:
            workflow.notify_new_export(export)
            print(f"   ✅ Notification sent for {export.nomenclature}")
        
        # Test 3: Get review stats
        print("\n📊 Testing: Review statistics")
        stats = workflow.get_review_stats()
        print("   Review Stats:")
        for key, value in stats.items():
            print(f"     • {key}: {value}")
        
        # Test 4: Save review state
        print("\n💾 Testing: Save review state")
        workflow.save_review_state()
        print("   ✅ Review state saved")
        
        # Test 5: Simulate review request (if we have exports)
        if new_exports:
            print(f"\n🎯 Testing: Review request for {new_exports[0].nomenclature}")
            success = workflow.request_review(new_exports[0].nomenclature, "Test User")
            if success:
                print("   ✅ Review request successful")
            else:
                print("   ❌ Review request failed")
        
        print("\n🎉 All tests completed!")
        
    except Exception as e:
        print(f"❌ Error during testing: {e}")
        import traceback
        traceback.print_exc()

def interactive_review_test():
    """Interactive test mode"""
    print("🎮 Interactive Review Workflow Test")
    print("=" * 40)
    
    # Load configuration
    config_path = Path(__file__).parent.parent / "config" / "integrations.json"
    if not config_path.exists():
        print("❌ Configuration not found")
        return
    
    with open(config_path, 'r') as f:
        config = json.load(f)
    
    # Initialize workflow manager
    workflow = ReviewWorkflowManager(config)
    
    while True:
        print("\n📋 Available actions:")
        print("1. Scan for new exports")
        print("2. List current review items")
        print("3. Request review for a shot")
        print("4. Update review status")
        print("5. Get review statistics")
        print("6. Save review state")
        print("7. Exit")
        
        choice = input("\nSelect action (1-7): ").strip()
        
        if choice == '1':
            print("\n🔍 Scanning for new exports...")
            new_exports = workflow.scan_new_exports()
            print(f"Found {len(new_exports)} new exports:")
            for export in new_exports:
                print(f"  • {export.nomenclature} v{export.version} - {export.status.value}")
                workflow.notify_new_export(export)
        
        elif choice == '2':
            print("\n📋 Current review items:")
            if workflow.review_items:
                for key, item in workflow.review_items.items():
                    print(f"  • {item.nomenclature} v{item.version} - {item.status.value}")
                    if item.frameio_review_link:
                        print(f"    Frame.io: {item.frameio_review_link}")
            else:
                print("  No review items found")
        
        elif choice == '3':
            nomenclature = input("Enter nomenclature (e.g., UNDLM_00001): ").strip()
            user_name = input("Enter user name: ").strip() or "Test User"
            success = workflow.request_review(nomenclature, user_name)
            if success:
                print(f"✅ Review requested for {nomenclature}")
            else:
                print(f"❌ Failed to request review for {nomenclature}")
        
        elif choice == '4':
            nomenclature = input("Enter nomenclature: ").strip()
            print("Status options: approved, rejected")
            status_input = input("Enter status: ").strip().lower()
            
            if status_input == 'approved':
                status = ReviewStatus.APPROVED
            elif status_input == 'rejected':
                status = ReviewStatus.REJECTED
            else:
                print("❌ Invalid status")
                continue
            
            supervisor_name = input("Enter supervisor name: ").strip() or "Test Supervisor"
            success = workflow.update_review_status(nomenclature, status, supervisor_name)
            if success:
                print(f"✅ Status updated for {nomenclature}")
            else:
                print(f"❌ Failed to update status for {nomenclature}")
        
        elif choice == '5':
            print("\n📊 Review Statistics:")
            stats = workflow.get_review_stats()
            for key, value in stats.items():
                print(f"  • {key}: {value}")
        
        elif choice == '6':
            workflow.save_review_state()
            print("✅ Review state saved")
        
        elif choice == '7':
            print("👋 Goodbye!")
            break
        
        else:
            print("❌ Invalid choice")

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--interactive":
        interactive_review_test()
    else:
        test_review_workflow()
