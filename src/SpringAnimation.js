
import React, { useEffect, useRef,useState } from 'react';
import { View, Animated, StyleSheet, Image,Easing } from 'react-native';
// spring animation for splash screen
export default function SpringAnimation() {
    let startValue = useRef(new Animated.Value(0.5)).current;
    const endValue = 1;

    const fadeAnim = useRef(new Animated.Value(0)).current;
   
    useEffect(() => {
        Animated.spring(startValue, {
            toValue: endValue,
            friction: 0.5,
            useNativeDriver: true,
        }).start();

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
        }).start();
        
    }, [startValue]);

    return (
        
        <Animated.View style={{ flex: 1, backgroundColor: '#fed857', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', opacity: fadeAnim}}>
            <Animated.View
                style={[
                    styles.square,
                    {
                        transform: [
                            {
                                scale: startValue,
                            },
                        ],
                    },
                ]}
            >
                <Image
                    source={require('./assets/geetapariwar-logo.png')}
                    style={{ height: "100%", width: "100%" }}
                />
            </Animated.View>
        </Animated.View>
        
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    square: {
        justifyContent: 'center',
        alignItems: 'center',
        height:70, width:200,
    },
});
