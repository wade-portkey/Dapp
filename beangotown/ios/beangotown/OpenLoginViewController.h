//
//  OpenLoginViewController.h
//  beangotown
//
//  Created by wade-cui on 2024/2/26.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface OpenLoginViewController : UIViewController

@property (nonatomic, copy) void(^loginCallback)(id);

- (void)startLoginWithURL:(NSURL *)url;

@end

NS_ASSUME_NONNULL_END
